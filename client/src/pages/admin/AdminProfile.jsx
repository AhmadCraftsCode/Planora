import { useState, useEffect } from "react";
import axios from "axios";
import { FaCamera, FaTimes, FaSave, FaUserEdit } from "react-icons/fa";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State & Errors
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/api/users/profile", {
        headers: { Authorization: token },
      });
      setUser(res.data);
      
      // Pre-fill form data
      const formattedDob = res.data.dob ? new Date(res.data.dob).toISOString().split('T')[0] : "";
      setFormData({ ...res.data, dob: formattedDob });
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    let error = "";

    // 1. AUTO-MASKING
    if (name === "phone") {
      val = val.replace(/[^0-9]/g, ""); 
      if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
      val = val.slice(0, 12);
    }
    if (name === "cnic") {
      val = val.replace(/[^0-9]/g, "");
      if (val.length > 5) val = val.slice(0, 5) + "-" + val.slice(5);
      if (val.length > 13) val = val.slice(0, 13) + "-" + val.slice(13);
      val = val.slice(0, 15);
    }

    // 2. VALIDATION RULES
    switch (name) {
      case "fullName":
      case "city":
      case "assignedArea":
      case "hotelName":
      case "carName":
        if (!/^[a-zA-Z\s]*$/.test(val)) error = "Text only (No numbers/symbols).";
        break;
      case "carModel":
      case "pricePerKm":
      case "pricePerDay":
        if (!/^[0-9]*$/.test(val)) error = "Numbers only.";
        break;
      case "licenseNumber":
        if (!/^[A-Z0-9-]*$/.test(val)) error = "Uppercase letters, numbers and dashes only.";
        break;
      default: break;
    }

    setFormData({ ...formData, [name]: val });
    setErrors({ ...errors, [name]: error });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(x => x !== "");
    if (hasErrors) {
      alert("Please fix errors before saving.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.put("/api/users/profile/update", formData, {
        headers: { Authorization: token },
      });

      setUser(res.data);
      
      const currentUser = JSON.parse(sessionStorage.getItem("user"));
      const updatedUserStorage = { ...currentUser, ...res.data };
      sessionStorage.setItem("user", JSON.stringify(updatedUserStorage));
      window.dispatchEvent(new Event("userUpdated"));

      setIsEditing(false);
      setErrors({});
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!user) return <div className="text-center text-gray-400 mt-20">Loading...</div>;

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="bg-[#0F172A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-lg flex items-center gap-2"
        >
          <FaUserEdit /> Edit Profile
        </button>
      </div>

      {/* --- VIEW CARD --- */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10 items-start">
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
          <div className="w-32 h-32 rounded-full p-1 border-2 border-gray-100 overflow-hidden">
            <img 
              src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 w-full">
          <DetailItem label="Full Name" value={user.fullName} />
          <DetailItem label="Email Address" value={user.email} />
          <DetailItem label="Phone Number" value={user.phone} />
          <DetailItem label="CNIC Number" value={user.cnic} />
          <DetailItem label="Gender" value={user.gender} />
          <DetailItem label="Date of Birth" value={user.dob ? new Date(user.dob).toDateString() : "N/A"} />

          {/* --- DYNAMIC ATTRIBUTES (VIEW LOGIC) --- */}
          
          {user.role === "Admin" && (
            <DetailItem label="Qualification" value={user.qualification} />
          )}

          {user.role === "TravelAgent" && (
            <DetailItem label="Assigned Area" value={user.assignedArea} />
          )}

          {user.role === "HotelManager" && (
            <DetailItem label="Hotel Name" value={user.hotelName} />
          )}

          {user.role === "Guide" && (
            <>
              <DetailItem label="Languages" value={user.language} />
              <DetailItem label="Daily Rate" value={`PKR ${user.pricePerDay || 3000}`} />
            </>
          )}

          {user.role === "Customer" && (
            <DetailItem label="Current City" value={user.city} />
          )}
          
          {user.role === "Driver" && (
            <>
              <DetailItem label="License Number" value={user.licenseNumber} />
              <DetailItem label="Car Name" value={user.carName} />
              <DetailItem label="Car Model" value={user.carModel} />
              <DetailItem label="Rate" value={`PKR ${user.pricePerKm || 0} / km`} />
            </>
          )}

          <DetailItem label="Home Address" value={user.address} span={2} />
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0">
              <h3 className="text-lg font-semibold text-gray-800">Edit Personal Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar">
              <form onSubmit={handleUpdate} className="space-y-6">
                
                <div className="flex gap-4 items-center mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm overflow-hidden">
                         {formData.profilePicture ? <img src={formData.profilePicture} className="w-full h-full object-cover"/> : <FaCamera size={18} />}
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Profile Image URL</label>
                        <input 
                            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none mt-1 border-b border-transparent focus:border-blue-500 transition-all"
                            name="profilePicture"
                            placeholder="https://..."
                            value={formData.profilePicture || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModernInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                    <ModernInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} maxLength={12} />
                    <ModernInput label="CNIC" name="cnic" value={formData.cnic} onChange={handleChange} error={errors.cnic} maxLength={15} />
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Gender</label>
                        <select name="gender" onChange={handleChange} value={formData.gender} className="w-full p-3.5 bg-gray-50 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    {/* --- DYNAMIC EDIT FIELDS --- */}
                    {user.role === "Admin" && <ModernInput label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} />}
                    {user.role === "TravelAgent" && <ModernInput label="Assigned Area" name="assignedArea" value={formData.assignedArea} onChange={handleChange} />}
                    {user.role === "HotelManager" && <ModernInput label="Hotel Name" name="hotelName" value={formData.hotelName} onChange={handleChange} />}
                    {user.role === "Customer" && <ModernInput label="Current City" name="city" value={formData.city} onChange={handleChange} />}
                    
                    {user.role === "Guide" && (
                      <>
                        <ModernInput label="Languages" name="language" value={formData.language} onChange={handleChange} />
                        <ModernInput label="Daily Rate (PKR)" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} error={errors.pricePerDay} />
                      </>
                    )}

                    {user.role === "Driver" && (
                      <>
                        <ModernInput label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} error={errors.licenseNumber} />
                        <ModernInput label="Car Name" name="carName" value={formData.carName} onChange={handleChange} error={errors.carName} />
                        <ModernInput label="Car Model" name="carModel" value={formData.carModel} onChange={handleChange} error={errors.carModel} />
                        <ModernInput label="Price / KM" name="pricePerKm" value={formData.pricePerKm} onChange={handleChange} error={errors.pricePerKm} />
                      </>
                    )}

                    <div className="col-span-2">
                         <ModernInput label="Address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#0F172A] text-white hover:bg-slate-800 shadow-lg transition flex items-center gap-2">
                    <FaSave /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DetailItem = ({ label, value, span = 1 }) => (
  <div className={span === 2 ? "col-span-2" : ""}>
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
    <p className="text-base font-medium text-gray-800 mt-1">{value || "N/A"}</p>
  </div>
);

const ModernInput = ({ label, name, value, onChange, error, maxLength }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">{label}</label>
    <input 
      type="text" 
      name={name}
      className={`w-full p-3.5 bg-gray-50 rounded-xl text-sm outline-none transition-all
        ${error ? "border border-red-500 bg-red-50 text-red-900" : "focus:bg-white focus:ring-2 focus:ring-blue-500/10"}`} 
      value={value || ""} 
      onChange={onChange}
      maxLength={maxLength}
    />
    {error && <p className="text-[10px] text-red-600 mt-1 font-semibold ml-1">{error}</p>}
  </div>
);

export default AdminProfile;