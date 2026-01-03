import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaIdCard, FaMapMarkerAlt, FaCar, FaHotel, FaLanguage, FaCity, FaCamera, FaCircleNotch, FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Customer");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false); // Checking Indicator
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", phone: "", address: "", 
    dob: "", cnic: "", gender: "Male", profilePicture: "",
    city: "", assignedArea: "", hotelName: "", language: "", 
    licenseNumber: "", carName: "", carModel: "", pricePerKm: ""
  });

  const [errors, setErrors] = useState({});

  // --- 1. RUNTIME DUPLICATE CHECKER ---
  // Triggers when you click outside the Email or CNIC box
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    
    if ((name === "email" || name === "cnic") && value.length > 5) {
      try {
        setChecking(true);
        const res = await axios.post("/api/auth/check-exists", { field: name, value });
        
        if (res.data.exists) {
          // If duplicate found, set the error state immediately
          setErrors(prev => ({ ...prev, [name]: res.data.message }));
        } else {
          // If valid and no other format errors, clear the error
          if (errors[name] && errors[name].includes("registered")) {
             setErrors(prev => ({ ...prev, [name]: "" }));
          }
        }
      } catch (err) {
        console.error("Check failed", err);
      } finally {
        setChecking(false);
      }
    }
  };

  // --- 2. VALIDATION & MASKING ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    let error = "";

    // Masking (Auto-add dashes)
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

    // Client-side Validation Rules
    switch (name) {
      case "fullName": 
        if (!/^[a-zA-Z\s]*$/.test(val)) error = "Text only (No numbers)."; 
        break;
      
      case "email": 
        // Updated Regex: Allows letters, numbers, dots, hyphens (e.g. customer1@...)
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val)) error = "Invalid email format."; 
        break;
      
      case "password": 
        if (val.length < 8) error = "Min 8 chars.";
        else if (!/[A-Z]/.test(val)) error = "Need 1 Capital Letter.";
        else if (!/[!@#$%^&*]/.test(val)) error = "Need 1 Special Char (!@#).";
        break;
      
      case "phone": 
        if (val.length < 12) error = "Incomplete Phone Number."; 
        break;
      
      case "cnic": 
        if (val.length < 15) error = "Incomplete CNIC."; 
        break;
      
      case "dob": 
        const age = new Date().getFullYear() - new Date(val).getFullYear();
        if (age < 18) error = "Must be 18+ to register.";
        break;
      
      case "city": case "assignedArea": case "hotelName": case "carName":
        if (!/^[a-zA-Z\s]*$/.test(val)) error = "Text only."; 
        break;
      
      case "language": 
        if (!/^[a-zA-Z,\s]*$/.test(val)) error = "Text only."; 
        break;
      
      case "carModel": case "pricePerKm": 
        if (!/^[0-9]*$/.test(val)) error = "Numbers only."; 
        break;
      
      case "licenseNumber": 
        if (!/^[A-Z0-9-]*$/.test(val)) error = "Invalid format (Uppercase only)."; 
        break;
      
      default: break;
    }

    setFormData({ ...formData, [name]: val });
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasErrors = Object.values(errors).some(x => x !== "");
    const hasEmpty = !formData.fullName || !formData.email || !formData.password; 

    if (hasErrors || hasEmpty) return alert("Please fix errors or fill required fields.");

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

  const isInvalid = loading || checking || Object.values(errors).some(x => x !== "");

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Role Selector */}
        <div className="bg-[#0F172A] text-white md:w-1/3 p-10 flex flex-col justify-between">
          <div>
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                      role === r 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {r.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
             </div>
          </div>
          <p className="text-xs text-slate-500 mt-6">© 2026 Planora Inc.</p>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-10 overflow-y-auto max-h-[90vh] no-scrollbar">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create {role} Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Full Name" name="fullName" value={formData.fullName} error={errors.fullName} placeholder="e.g. Ali Ahmed" icon={FaUser} onChange={handleChange} />
              
              {/* EMAIL INPUT WITH ONBLUR CHECK */}
              <Input 
                label="Email Address" 
                name="email" 
                type="email" 
                value={formData.email} 
                error={errors.email} 
                placeholder="customer1@planora.com" 
                icon={FaEnvelope} 
                onChange={handleChange} 
                onBlur={handleBlur} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Phone Number" name="phone" value={formData.phone} error={errors.phone} placeholder="0300-1234567" icon={FaPhone} onChange={handleChange} maxLength={12} />
              
              {/* CNIC INPUT WITH ONBLUR CHECK */}
              <Input 
                label="CNIC" 
                name="cnic" 
                value={formData.cnic} 
                error={errors.cnic} 
                placeholder="35202-..." 
                icon={FaIdCard} 
                onChange={handleChange} 
                maxLength={15} 
                onBlur={handleBlur}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Password" name="password" type="password" value={formData.password} error={errors.password} placeholder="••••••••" icon={FaLock} onChange={handleChange} />
              
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                <select name="gender" onChange={handleChange} className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <Input label="Date of Birth" name="dob" type="date" value={formData.dob} error={errors.dob} onChange={handleChange} />
            <Input label="Home Address" name="address" value={formData.address} placeholder="Full residential address" icon={FaMapMarkerAlt} onChange={handleChange} />

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
              disabled={isInvalid}
              className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading || checking ? <FaCircleNotch className="animate-spin"/> : "Create Account"}
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

// Reusable Input Component with onBlur
const Input = ({ label, name, type="text", placeholder, icon: Icon, value, onChange, onBlur, error, maxLength }) => (
  <div className="w-full group">
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
    <div className="relative">
      <input 
        type={type} 
        name={name}
        required
        value={value}
        onChange={onChange}
        onBlur={onBlur} // Triggers backend check when clicking outside
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
    {/* Real-time Error Display */}
    {error && <p className="text-[10px] text-red-600 mt-1 font-semibold ml-1 flex items-center gap-1">● {error}</p>}
  </div>
);

export default Register;