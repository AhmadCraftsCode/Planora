import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaExclamationCircle, FaBox, FaHotel, FaCar, FaUser } from "react-icons/fa";

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [resources, setResources] = useState({ hotels: [], guides: [], drivers: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "", destination: "", duration: "", seats: "", price: "", description: "",
    startDate: "", 
    images: "", 
    hotelId: "", guideId: "", driverId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPackages();
    fetchResources();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = sessionStorage.getItem("token");
      // Using relative path for Vercel/Localhost compatibility
      const res = await axios.get("/api/packages/all", { headers: { Authorization: token } });
      setPackages(res.data);
    } catch (err) {
      console.error("Error fetching packages", err);
    }
  };

  const fetchResources = async () => {
    try {
      const token = sessionStorage.getItem("token");
      // Using relative path
      const res = await axios.get("/api/packages/resources", { headers: { Authorization: token } });
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources", err);
    }
  };

  // --- VALIDATION LOGIC ---
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!/^[a-zA-Z0-9\s\-]+$/.test(value)) error = "Text and numbers only.";
        if (value.length < 5) error = "Min 5 chars.";
        break;
      case "destination":
        if (!/^[a-zA-Z\s]+$/.test(value)) error = "Text only.";
        break;
      case "duration": case "seats": case "price":
        if (value <= 0) error = "Must be positive.";
        break;
      case "startDate":
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) error = "Cannot be in the past.";
        break;
      case "description":
        if (value.length < 10) error = "Too short.";
        break;
      default: break;
    }
    return error;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some(x => x !== "");
    const hasEmpty = Object.values(formData).some(x => x === "" && x !== formData.images && x !== formData.hotelId && x !== formData.driverId && x !== formData.guideId);
    
    if (hasErrors || hasEmpty) {
      alert("Please fix errors and fill required fields.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const itinerary = Array.from({ length: formData.duration }, (_, i) => ({
        day: i + 1, 
        activity: `Day ${i+1}: Explore ${formData.destination}` 
      }));

      const payload = {
        ...formData,
        images: formData.images.split(",").map(i => i.trim()),
        itinerary
      };

      await axios.post("/api/packages/create", payload, { headers: { Authorization: token } });
      fetchPackages();
      setIsModalOpen(false);
      setFormData({
        title: "", destination: "", duration: "", seats: "", price: "", description: "",
        startDate: "", images: "", hotelId: "", guideId: "", driverId: ""
      });
      setErrors({});
      alert("Package Published Successfully!");
    } catch (err) {
      alert("Failed to create package.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this package?")) return;
    const token = sessionStorage.getItem("token");
    await axios.delete(`/api/packages/${id}`, { headers: { Authorization: token } });
    fetchPackages();
  };

  const isPackageExpired = (dateString) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return new Date(dateString) < today;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Tour Packages</h1>
           <p className="text-sm text-gray-500">Create and manage upcoming trips.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg flex items-center gap-2">
          <FaPlus /> Create Package
        </button>
      </div>

      {/* PACKAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => {
          const expired = isPackageExpired(pkg.startDate);
          return (
            <div key={pkg._id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition ${expired ? 'border-red-200 opacity-70' : 'border-gray-200'}`}>
              <div className="h-48 bg-gray-200 relative">
                 <img src={pkg.images[0] || "https://via.placeholder.com/300"} className="w-full h-full object-cover" />
                 <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">{pkg.duration} Days</div>
                 {expired ? (
                   <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1"><FaExclamationCircle /> EXPIRED</div>
                 ) : (
                   <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">ACTIVE</div>
                 )}
              </div>

              <div className="p-5">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{pkg.title}</h3>
                    <p className="text-indigo-600 font-bold">Rs. {pkg.price.toLocaleString()}</p>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-3 text-gray-500 text-xs mb-4">
                    <span className="flex items-center gap-1"><FaMapMarkerAlt /> {pkg.destination}</span>
                    <span className="flex items-center gap-1"><FaUsers /> {pkg.seats} Seats</span>
                    <span className={`flex items-center gap-1 font-bold ${expired ? 'text-red-500' : 'text-green-600'}`}>
                      <FaCalendarAlt /> {new Date(pkg.startDate).toDateString()}
                    </span>
                 </div>
                 
                 <div className="bg-indigo-50 p-3 rounded-lg space-y-1 text-xs text-gray-600 mb-4 border border-indigo-100">
                    <p><span className="font-bold text-indigo-800">Hotel:</span> {pkg.hotelId?.name || "None"}</p>
                    <p><span className="font-bold text-indigo-800">Guide:</span> {pkg.guideId?.fullName || "None"}</p>
                    <p><span className="font-bold text-indigo-800">Driver:</span> {pkg.driverId?.fullName || "None"}</p>
                 </div>

                 <button onClick={() => handleDelete(pkg._id)} className="w-full py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center justify-center gap-2 transition">
                   <FaTrash size={12} /> Delete Package
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-indigo-900">Create New Tour Package</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
            
            <div className="p-8 overflow-y-auto no-scrollbar">
              <form onSubmit={handleCreate} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input label="Package Title" placeholder="e.g. 5 Days Trip to Naran" value={formData.title} onChange={v => handleChange("title", v)} error={errors.title} />
                   <Input label="Destination" placeholder="e.g. Naran Kaghan" value={formData.destination} onChange={v => handleChange("destination", v)} error={errors.destination} />
                   
                   <div>
                     <label className="block text-xs font-bold text-indigo-800 uppercase mb-1">Start Date</label>
                     <input type="date" required className={`w-full p-3 bg-white rounded-xl text-sm border outline-none ${errors.startDate ? "border-red-500" : "border-indigo-200 focus:border-indigo-500"}`} value={formData.startDate} onChange={e => handleChange("startDate", e.target.value)} />
                     {errors.startDate && <p className="text-[10px] text-red-600 mt-1">{errors.startDate}</p>}
                   </div>

                   <Input label="Duration (Days)" type="number" value={formData.duration} onChange={v => handleChange("duration", v)} error={errors.duration} />
                   <Input label="Total Seats" type="number" value={formData.seats} onChange={v => handleChange("seats", v)} error={errors.seats} />
                   <Input label="Price per Person (PKR)" type="number" value={formData.price} onChange={v => handleChange("price", v)} error={errors.price} />
                </div>
                
                <Input label="Image URL (Comma separated)" placeholder="https://img1.jpg, https://img2.jpg" value={formData.images} onChange={v => handleChange("images", v)} error={errors.images} />

                {/* --- RESOURCE SELECTION (With No-Data Feedback) --- */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                   
                   <Select label="Assign Hotel" value={formData.hotelId} onChange={v => handleChange("hotelId", v)} icon={FaHotel}>
                      <option value="">Select Hotel</option>
                      {resources.hotels.length > 0 
                        ? resources.hotels.map(h => <option key={h._id} value={h._id}>{h.name} ({h.city})</option>)
                        : <option disabled>No Hotels Created Yet</option>
                      }
                   </Select>

                   <Select label="Assign Guide" value={formData.guideId} onChange={v => handleChange("guideId", v)} icon={FaUser}>
                      <option value="">Select Tour Guide</option>
                      {resources.guides.length > 0 
                        ? resources.guides.map(g => <option key={g._id} value={g._id}>{g.fullName} ({g.language})</option>)
                        : <option disabled>No Approved Guides</option>
                      }
                   </Select>

                   <Select label="Assign Driver" value={formData.driverId} onChange={v => handleChange("driverId", v)} icon={FaCar}>
                      <option value="">Select Driver</option>
                      {resources.drivers.length > 0 
                        ? resources.drivers.map(d => <option key={d._id} value={d._id}>{d.fullName} ({d.licenseNumber})</option>)
                        : <option disabled>No Approved Drivers</option>
                      }
                   </Select>

                </div>

                <div>
                   <label className="block text-xs font-bold text-indigo-800 uppercase mb-1">Description</label>
                   <textarea className={`w-full p-3 bg-white border rounded-xl text-sm outline-none ${errors.description ? "border-red-500" : "border-indigo-200 focus:border-indigo-500"}`} rows="3" value={formData.description} onChange={e => handleChange("description", e.target.value)}></textarea>
                   {errors.description && <p className="text-[10px] text-red-600 mt-1">{errors.description}</p>}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50">
                  {loading ? "Creating..." : "Publish Package"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange, type="text", placeholder, error }) => (
  <div>
    <label className="block text-xs font-bold text-indigo-800 uppercase mb-1">{label}</label>
    <input type={type} className={`w-full p-3 bg-white rounded-xl text-sm border outline-none transition ${error ? "border-red-500 bg-red-50 text-red-900" : "border-indigo-200 focus:border-indigo-500"}`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required />
    {error && <p className="text-[10px] text-red-600 mt-1 font-semibold">{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, children, icon: Icon }) => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
        {Icon && <Icon className="text-indigo-500"/>} {label}
      </label>
      <select className="w-full p-3 bg-white rounded-xl text-sm border border-gray-300 focus:border-indigo-500 outline-none cursor-pointer" value={value} onChange={e => onChange(e.target.value)}>
        {children}
      </select>
    </div>
);

export default ManagePackages;