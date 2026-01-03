import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaIdCard, FaMapMarkerAlt, FaCar, FaHotel, FaLanguage, FaCity, FaCamera } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Customer");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", phone: "", address: "", 
    dob: "", cnic: "", gender: "Male", profilePicture: "",
    city: "", assignedArea: "", hotelName: "", language: "", 
    licenseNumber: "", carName: "", carModel: "", pricePerKm: ""
  });

  const [errors, setErrors] = useState({});

  // --- VALIDATION LOGIC (Kept Exact Same) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    let error = "";

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

    switch (name) {
      case "fullName": if (!/^[a-zA-Z\s]*$/.test(val)) error = "Text only."; break;
      case "email": if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = "Invalid email."; break;
      case "password": 
        if (val.length < 8) error = "Min 8 chars.";
        else if (!/[A-Z]/.test(val)) error = "Need 1 Capital.";
        else if (!/[!@#$%^&*]/.test(val)) error = "Need 1 Symbol.";
        break;
      case "phone": if (val.length < 12) error = "Incomplete."; break;
      case "cnic": if (val.length < 15) error = "Incomplete."; break;
      case "dob": 
        const age = new Date().getFullYear() - new Date(val).getFullYear();
        if (age < 18) error = "Must be 18+.";
        break;
      case "city": case "assignedArea": case "hotelName": case "carName":
        if (!/^[a-zA-Z\s]*$/.test(val)) error = "Text only."; break;
      case "language": if (!/^[a-zA-Z,\s]*$/.test(val)) error = "Text only."; break;
      case "carModel": case "pricePerKm": if (!/^[0-9]*$/.test(val)) error = "Numbers only."; break;
      case "licenseNumber": if (!/^[A-Z0-9-]*$/.test(val)) error = "Invalid format."; break;
      default: break;
    }

    setFormData({ ...formData, [name]: val });
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(x => x !== "");
    if (hasErrors) return alert("Please fix form errors.");

    setLoading(true);
    try {
      await axios.post("/api/auth/register", { ...formData, role });
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Role Selector */}
        <div className="bg-[#0F172A] text-white md:w-1/3 p-10 flex flex-col justify-between">
          <div>
            {/* BACK BUTTON ADDED HERE */}
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm font-medium">
              <FaArrowLeft /> Back to Home
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">Planora.</h1>
            <p className="text-blue-200 mt-2 text-sm">Join the ultimate travel management platform.</p>
          </div>
          <div className="space-y-4">
             <h3 className="text-lg font-semibold">Get Started as:</h3>
             <div className="flex flex-wrap gap-2">
                {["Customer", "TravelAgent", "Guide", "Driver", "HotelManager"].map((r) => (
                  <button 
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setErrors({}); setFormData({...formData, fullName: ""}); }} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      role === r ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {r.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
             </div>
          </div>
          <p className="text-xs text-slate-500 mt-6">© 2025 Planora Inc.</p>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-10 overflow-y-auto max-h-[90vh] no-scrollbar">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create {role} Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Full Name" name="fullName" value={formData.fullName} error={errors.fullName} placeholder="e.g. Ali Ahmed" onChange={handleChange} />
              <Input label="Email Address" name="email" type="email" value={formData.email} error={errors.email} placeholder="ali@example.com" onChange={handleChange} />
              <Input label="Password" name="password" type="password" value={formData.password} error={errors.password} placeholder="••••••••" onChange={handleChange} />
              <Input label="Phone Number" name="phone" value={formData.phone} error={errors.phone} placeholder="0300-1234567" onChange={handleChange} maxLength={12} />
              <Input label="CNIC" name="cnic" value={formData.cnic} error={errors.cnic} placeholder="35202-1234567-1" icon={FaIdCard} onChange={handleChange} maxLength={15} />
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                <select name="gender" onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border border-gray-200">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <Input label="Date of Birth" name="dob" type="date" value={formData.dob} error={errors.dob} onChange={handleChange} />
            </div>

            <Input label="Home Address" name="address" value={formData.address} placeholder="House #, Street #, Lahore" icon={FaMapMarkerAlt} onChange={handleChange} />

            <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm border"><FaCamera/></div>
               <input name="profilePicture" onChange={handleChange} placeholder="Profile Image URL (https://...)" className="bg-transparent w-full text-sm outline-none" />
            </div>

            {/* DYNAMIC FIELDS */}
            <div className="pt-4 border-t border-gray-100">
               {role !== "Admin" && <h3 className="text-sm font-bold text-blue-600 uppercase mb-4">{role} Details</h3>}
               
               {role === "Customer" && <Input label="Current City" name="city" value={formData.city} error={errors.city} icon={FaCity} onChange={handleChange} />}
               {role === "TravelAgent" && <Input label="Assigned Area" name="assignedArea" value={formData.assignedArea} error={errors.assignedArea} icon={FaMapMarkerAlt} onChange={handleChange} />}
               {role === "HotelManager" && <Input label="Hotel Name" name="hotelName" value={formData.hotelName} error={errors.hotelName} icon={FaHotel} onChange={handleChange} />}
               {role === "Guide" && <Input label="Languages" name="language" value={formData.language} error={errors.language} icon={FaLanguage} onChange={handleChange} />}
               
               {role === "Driver" && (
                 <>
                   <Input label="License #" name="licenseNumber" value={formData.licenseNumber} error={errors.licenseNumber} icon={FaCar} onChange={handleChange} />
                   <div className="grid grid-cols-2 gap-4">
                      <Input label="Car Name" name="carName" value={formData.carName} error={errors.carName} onChange={handleChange} />
                      <Input label="Car Model" name="carModel" value={formData.carModel} error={errors.carModel} onChange={handleChange} />
                   </div>
                   <Input label="Price/Km" name="pricePerKm" value={formData.pricePerKm} error={errors.pricePerKm} onChange={handleChange} />
                 </>
               )}
            </div>

            <button 
              type="submit" 
              disabled={loading || Object.values(errors).some(x => x !== "")}
              className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FaCircleNotch className="animate-spin inline mr-2"/> : ""}
              {loading ? "Registering..." : `Register as ${role}`}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Clean Input
const Input = ({ label, name, type="text", placeholder, icon: Icon, value, onChange, error, maxLength }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
    <div className="relative">
      <input 
        type={type} 
        name={name}
        required
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full p-3 bg-gray-50 rounded-xl text-sm outline-none border transition-all pl-4 
          ${error 
            ? "border-red-500 bg-red-50 text-red-900" 
            : "border-gray-200 focus:border-blue-500"
          }`}
        placeholder={placeholder}
      />
      {Icon && <Icon className={`absolute right-4 top-3.5 ${error ? "text-red-400" : "text-gray-400"}`} />}
    </div>
    {error && <p className="text-[10px] text-red-600 mt-1 font-semibold ml-1">{error}</p>}
  </div>
);

export default Register;