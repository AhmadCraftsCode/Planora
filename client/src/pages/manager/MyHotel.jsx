import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCamera, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaSnowflake, FaDumbbell } from "react-icons/fa";

const MyHotel = () => {
  const [hotel, setHotel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Available Amenities Options
  const amenityOptions = ["Free Wifi", "Swimming Pool", "Parking", "Restaurant", "Air Conditioning", "Gym", "Spa", "Room Service"];

  const [formData, setFormData] = useState({
    name: "", city: "", address: "", description: "", pricePerNight: 0,
    images: { img1: "", img2: "", img3: "" },
    amenities: [] // Store selected amenities here
  });

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

  const handleUpdate = async (e) => {
    e.preventDefault();
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

  // Toggle Amenity Logic
  const toggleAmenity = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  if (!hotel) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Hotel</h1>
          <p className="text-sm text-gray-500">Manage your property details and amenities.</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-800 shadow-lg">
          <FaEdit className="inline mr-2"/> Update Info
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
                {/* Display Amenities Tags */}
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
                <p className="text-2xl font-bold text-purple-700">Rs. {hotel.pricePerNight}</p>
              </div>
           </div>
           <p className="mt-6 text-gray-600 leading-relaxed max-w-4xl border-t border-gray-100 pt-4">
             {hotel.description || "No description added yet."}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[hotel.images?.img1, hotel.images?.img2, hotel.images?.img3].map((img, idx) => (
             <div key={idx} className="h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
                {img ? (
                  <img src={img} alt={`Hotel ${idx+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Update Hotel Details</h3>
            </div>
            
            <div className="p-8 overflow-y-auto no-scrollbar">
              <form onSubmit={handleUpdate} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input label="Hotel Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                   <Input label="City" value={formData.city} onChange={v => setFormData({...formData, city: v})} />
                   <div className="col-span-2">
                      <Input label="Address" value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                   </div>
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                      <textarea 
                        className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 outline-none" rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                   </div>
                   
                   {/* AMENITIES SELECTION */}
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amenities</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {amenityOptions.map(option => (
                          <div 
                            key={option}
                            onClick={() => toggleAmenity(option)}
                            className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium border transition-all text-center
                              ${formData.amenities.includes(option) 
                                ? "bg-purple-600 text-white border-purple-600" 
                                : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"}`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                   </div>

                   <Input label="Price per Night (Rs)" type="number" value={formData.pricePerNight} onChange={v => setFormData({...formData, pricePerNight: v})} />
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-bold text-purple-700 uppercase mb-4">Gallery Images (URLs)</h4>
                  <div className="space-y-3">
                    <Input label="Image 1 URL" value={formData.images.img1} onChange={v => setFormData({...formData, images: {...formData.images, img1: v}})} placeholder="https://..." />
                    <Input label="Image 2 URL" value={formData.images.img2} onChange={v => setFormData({...formData, images: {...formData.images, img2: v}})} placeholder="https://..." />
                    <Input label="Image 3 URL" value={formData.images.img3} onChange={v => setFormData({...formData, images: {...formData.images, img3: v}})} placeholder="https://..." />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-purple-700 text-white hover:bg-purple-800 rounded-lg text-sm font-medium shadow-lg">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange, type="text", placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
    <input 
      type={type}
      className="w-full p-3 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 outline-none"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default MyHotel;