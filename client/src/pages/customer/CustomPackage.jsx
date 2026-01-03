import { useState, useEffect } from "react";
import axios from "axios";
import { FaHotel, FaCar, FaMapMarkedAlt, FaMoneyBillWave, FaCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomPackage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState({ hotels: [], drivers: [], guides: [] });
  
  const [formData, setFormData] = useState({
    title: "My Custom Trip",
    destination: "",
    duration: 3,
    startDate: "",
    hotelId: "",
    driverId: "",
    guideId: "",
    paymentMethod: "Credit/Debit Card"
  });

  const [errors, setErrors] = useState({});
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // 1. Fetch Resources
  useEffect(() => {
    const fetchResources = async () => {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("/api/packages/resources", {
        headers: { Authorization: token }
      });
      setResources(res.data);
    };
    fetchResources();
  }, []);

  // 2. Auto-Calculate Price
  useEffect(() => {
    let total = 0;
    const duration = Number(formData.duration) || 1;

    if (formData.hotelId) {
      const hotel = resources.hotels.find(h => h._id === formData.hotelId);
      if (hotel) total += (hotel.pricePerNight * duration);
    }

    if (formData.driverId) {
      const driver = resources.drivers.find(d => d._id === formData.driverId);
      if (driver) total += (driver.pricePerKm * 250 * duration);
    }

    if (formData.guideId) {
      total += (3000 * duration);
    }

    setEstimatedPrice(Math.round(total * 1.10)); // 10% Admin Fee
  }, [formData, resources]);

  // --- VALIDATION LOGIC ---
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (value.length < 5) error = "Title must be at least 5 characters.";
        if (!/^[a-zA-Z0-9\s\-]+$/.test(value)) error = "Text and numbers only.";
        break;
      case "destination":
        if (!/^[a-zA-Z\s]+$/.test(value)) error = "Destination must be text only.";
        break;
      case "duration":
        if (value <= 0) error = "Duration must be at least 1 day.";
        break;
      case "startDate":
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selected < today) error = "Trip cannot start in the past.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final Check
    const hasErrors = Object.values(errors).some(x => x);
    if (hasErrors || !formData.destination || !formData.startDate) {
      alert("Please fix the errors before proceeding.");
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post("/api/bookings/custom", formData, {
        headers: { Authorization: token }
      });
      alert("Custom Package Created & Booked!");
      navigate("/customer/bookings");
    } catch (err) {
      alert("Failed to book custom package");
    } finally {
      setLoading(false);
    }
  };

  // Button Logic: Disable if loading, price is 0 (empty), or errors exist
  const isInvalid = loading || estimatedPrice === 0 || Object.values(errors).some(x => x);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Build Your Custom Package</h1>
        <p className="text-gray-500 mt-2">Design your perfect itinerary. We handle the logistics.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Trip Details */}
          <div>
            <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2">
              <FaCalendarCheck /> Trip Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Trip Title" 
                value={formData.title} 
                onChange={v => handleInputChange("title", v)} 
                error={errors.title} 
              />
              <Input 
                label="Destination" 
                placeholder="e.g. Swat Valley" 
                value={formData.destination} 
                onChange={v => handleInputChange("destination", v)} 
                error={errors.destination} 
              />
              <Input 
                label="Start Date" 
                type="date" 
                value={formData.startDate} 
                onChange={v => handleInputChange("startDate", v)} 
                error={errors.startDate} 
              />
              <Input 
                label="Duration (Days)" 
                type="number" 
                value={formData.duration} 
                onChange={v => handleInputChange("duration", v)} 
                error={errors.duration} 
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Resources */}
          <div>
            <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2">
              <FaHotel /> Select Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select 
                label="Select Hotel" 
                icon={FaHotel} 
                value={formData.hotelId} 
                onChange={v => handleInputChange("hotelId", v)}
              >
                 <option value="">No Hotel Needed</option>
                 {resources.hotels.map(h => <option key={h._id} value={h._id}>{h.name} (Rs {h.pricePerNight}/night)</option>)}
              </Select>

              <Select 
                label="Select Driver" 
                icon={FaCar} 
                value={formData.driverId} 
                onChange={v => handleInputChange("driverId", v)}
              >
                 <option value="">No Driver Needed</option>
                 {resources.drivers.map(d => <option key={d._id} value={d._id}>{d.fullName} ({d.carName})</option>)}
              </Select>

              <Select 
                label="Select Guide" 
                icon={FaMapMarkedAlt} 
                value={formData.guideId} 
                onChange={v => handleInputChange("guideId", v)}
              >
                 <option value="">No Guide Needed</option>
                 {resources.guides.map(g => <option key={g._id} value={g._id}>{g.fullName} (Rs 3000/day)</option>)}
              </Select>
            </div>
          </div>

          {/* Section 3: Payment Summary */}
          <div className="bg-rose-50 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center border border-rose-100">
             <div>
               <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mb-1">Estimated Total Cost</p>
               <h2 className="text-4xl font-bold text-gray-800">PKR {estimatedPrice.toLocaleString()}</h2>
               <p className="text-[10px] text-gray-500 mt-1">Includes 10% Platform Service Fee</p>
             </div>

             <div className="w-full md:w-1/3 mt-6 md:mt-0">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Method</label>
               <div className="relative">
                 <FaMoneyBillWave className="absolute left-3 top-3.5 text-rose-400" />
                 <select 
                   className="w-full pl-10 p-3 bg-white rounded-lg text-sm border border-rose-200 focus:border-rose-500 outline-none cursor-pointer"
                   value={formData.paymentMethod}
                   onChange={e => handleInputChange("paymentMethod", e.target.value)}
                 >
                   <option>Credit/Debit Card</option>
                   <option>JazzCash</option>
                   <option>Easypaisa</option>
                 </select>
               </div>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isInvalid}
            className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm & Pay Now"}
          </button>

        </form>
      </div>
    </div>
  );
};

// --- Reusable Components with Error Support ---

const Input = ({ label, value, onChange, type="text", placeholder, error }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
    <input 
      type={type} 
      required
      className={`w-full p-3 bg-white rounded-xl text-sm outline-none border transition-all
        ${error ? "border-red-500 bg-red-50 text-red-900" : "border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {error && <p className="text-[10px] text-red-600 mt-1 font-semibold">{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, icon: Icon, children }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
      {Icon && <Icon className="text-rose-500"/>} {label}
    </label>
    <select 
      className="w-full p-3 bg-white rounded-xl text-sm border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition cursor-pointer"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {children}
    </select>
  </div>
);

export default CustomPackage;