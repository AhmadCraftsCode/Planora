import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCamera, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";

const MyHotel = () => {
  const [hotel, setHotel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Available Amenities Options
  const amenityOptions = ["Free Wifi", "Swimming Pool", "Parking", "Restaurant", "Air Conditioning", "Gym", "Spa", "Room Service"];

  const [formData, setFormData] = useState({
    name: "", city: "", address: "", description: "", pricePerNight: 0,
    images: { img1: "", img2: "", img3: "" },
    amenities: [] 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("/api/hotels/my-hotel", {
        headers: { Authorization: token },
      });
      setHotel(res.data);
      if(res.data.name) setFormData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- VALIDATION LOGIC ---
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!/^[a-zA-Z\s]+$/.test(value)) error = "Hotel Name must be text only.";
        if (value.length < 3) error = "Name too short.";
        break;
      case "city":
        if (!/^[a-zA-Z\s]+$/.test(value)) error = "City must be text only.";
        break;
      case "pricePerNight":
        if (value <= 0) error = "Price must be a positive number.";
        break;
      case "description":
        if (value.length < 20) error = "Description must be at least 20 characters.";
        break;
      case "img1": case "img2": case "img3":
        if (value && !value.includes("http")) error = "Must be a valid URL.";
        break;
      default: break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle Nested Images separately
    if (name.startsWith("img")) {
      setFormData(prev => ({
        ...prev,
        images: { ...prev.images, [name]: value }
      }));
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Final Check
    const hasErrors = Object.values(errors).some(x => x !== "");
    const hasEmpty = !formData.name || !formData.city || !formData.pricePerNight;

    if (hasErrors || hasEmpty) {
      alert("Please fix errors and fill required fields.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await axios.put("/api/hotels/update", formData, {
        headers: { Authorization: token },
      });
      fetchHotel();
      setIsEditing(false);
      alert("Hotel Information Updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  const toggleAmenity = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  // Button Logic
  const isInvalid = Object.values(errors).some(x => x !== "") || !formData.name;

  if (!hotel) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Hotel</h1>
          <p className="text-sm text-gray-500">Manage your property details and amenities.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)} 
          className="bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-800 shadow-lg flex items-center gap-2"
        >
          <FaEdit /> Update Info
        </button>
      </div>

      {/* --- VIEW MODE --- */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{hotel.name || "Hotel Name Not Set"}</h2>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                   <FaMapMarkerAlt className="text-purple-600"/>
                   <span>{hotel.address || "Address"}, {hotel.city || "City"}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {hotel.amenities?.map((am, index) => (
                    <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-bold">Price per Night</p>
                <p className="text-2xl font-bold text-purple-700">PKR {hotel.pricePerNight?.toLocaleString()}</p>
              </div>
           </div>
           <p className="mt-6 text-gray-600 leading-relaxed max-w-4xl border-t border-gray-100 pt-4">
             {hotel.description || "No description added yet."}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[hotel.images?.img1, hotel.images?.img2, hotel.images?.img3].map((img, idx) => (
             <div key={idx} className="h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative group flex items-center justify-center">
                {img ? (
                  <img src={img} alt={`Hotel ${idx+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <FaCamera size={30} />
                    <p className="text-xs mt-2 font-medium">No Image</p>
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-purple-900">Update Hotel Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500"><FaTimes size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto no-scrollbar">
              <form onSubmit={handleUpdate} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input label="Hotel Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="e.g. Pearl Continental" />
                   <Input label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} placeholder="e.g. Lahore" />
                   
                   <div className="col-span-2">
                      <Input label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" />
                   </div>
                   
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Description</label>
                      <textarea 
                        name="description"
                        className={`w-full p-3 bg-white border rounded-xl text-sm outline-none transition
                          ${errors.description ? "border-red-500 bg-red-50" : "border-purple-200 focus:border-purple-500"}`}
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                      {errors.description && <p className="text-[10px] text-red-600 mt-1 font-bold">{errors.description}</p>}
                   </div>
                   
                   {/* Amenities */}
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-purple-800 uppercase mb-2">Amenities</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {amenityOptions.map(option => (
                          <div 
                            key={option}
                            onClick={() => toggleAmenity(option)}
                            className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium border transition-all text-center select-none
                              ${formData.amenities.includes(option) 
                                ? "bg-purple-600 text-white border-purple-600 shadow-md" 
                                : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"}`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                   </div>

                   <Input label="Price per Night (PKR)" name="pricePerNight" type="number" value={formData.pricePerNight} onChange={handleChange} error={errors.pricePerNight} />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-purple-700 uppercase mb-4">Gallery Images (URLs)</h4>
                  <div className="space-y-3">
                    <Input label="Image 1 URL" name="img1" value={formData.images.img1} onChange={handleChange} error={errors.img1} placeholder="https://..." />
                    <Input label="Image 2 URL" name="img2" value={formData.images.img2} onChange={handleChange} error={errors.img2} placeholder="https://..." />
                    <Input label="Image 3 URL" name="img3" value={formData.images.img3} onChange={handleChange} error={errors.img3} placeholder="https://..." />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isInvalid}
                    className="px-6 py-2.5 bg-purple-700 text-white hover:bg-purple-800 rounded-lg text-sm font-medium shadow-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Input with Error Styling
const Input = ({ label, name, value, onChange, type="text", placeholder, error }) => (
  <div>
    <label className="block text-xs font-bold text-purple-800 uppercase mb-1">{label}</label>
    <input 
      type={type}
      name={name}
      className={`w-full p-3 bg-white rounded-xl text-sm border outline-none transition
        ${error ? "border-red-500 bg-red-50 text-red-900" : "border-purple-200 focus:border-purple-500"}`}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <p className="text-[10px] text-red-600 mt-1 font-bold ml-1">● {error}</p>}
  </div>
);

export default MyHotel;