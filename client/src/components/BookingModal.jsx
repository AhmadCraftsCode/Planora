import { useState } from "react";
import axios from "axios";
import { FaTimes, FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import { API_URL } from "../config";

const BookingModal = ({ item, type, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [details, setDetails] = useState({
    date: type === "Package" ? item.startDate.split('T')[0] : "",
    guests: 1,
    duration: 1, 
    paymentMethod: "Credit/Debit Card",
    accountNumber: "", // Card or Phone Number
    securityCode: ""   // CVV or MPIN
  });

  const [errors, setErrors] = useState({});

  // --- VALIDATION LOGIC ---
  const validate = (name, value) => {
    let error = "";
    
    // STEP 1 VALIDATION
    if (name === "date" && type !== "Package") {
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selected < today) error = "Date cannot be in the past.";
    }
    if ((name === "guests" || name === "duration") && value < 1) {
      error = "Must be at least 1.";
    }

    // STEP 2 VALIDATION (Payment)
    if (name === "accountNumber") {
      // Remove spaces for checking
      const cleanVal = value.replace(/\s/g, "");
      if (!/^\d+$/.test(cleanVal)) {
        error = "Numbers only.";
      } else {
        if (details.paymentMethod === "Credit/Debit Card") {
          if (cleanVal.length !== 16) error = "Card number must be 16 digits.";
        } else {
          // JazzCash/Easypaisa
          if (cleanVal.length !== 11) error = "Mobile number must be 11 digits (03...).";
        }
      }
    }

    if (name === "securityCode") {
      if (!/^\d+$/.test(value)) {
        error = "Numbers only.";
      } else {
        if (details.paymentMethod === "Credit/Debit Card") {
          if (value.length < 3 || value.length > 4) error = "Invalid CVV.";
        } else {
          if (value.length !== 4) error = "MPIN must be 4 digits.";
        }
      }
    }

    return error;
  };

  const handleChange = (name, value) => {
    setDetails(prev => ({ ...prev, [name]: value }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const calculateTotal = () => {
    if (type === "Package") return item.price * details.guests;
    if (type === "Hotel") return item.pricePerNight * details.duration; 
    if (type === "Driver") return item.pricePerKm * 25 * details.duration; 
    if (type === "Guide") return (item.pricePerDay || 3000) * details.duration;
    return 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Final Validation Check before API Call
    if (step === 2) {
      const err1 = validate("accountNumber", details.accountNumber);
      const err2 = validate("securityCode", details.securityCode);
      if (err1 || err2) {
        setErrors({ accountNumber: err1, securityCode: err2 });
        return;
      }
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Please login to book!");
        window.location.href = "/login";
        return;
      }

      const payload = {
        bookingType: type,
        itemId: item._id,
        itemModel: type === "Driver" ? "User" : type,
        bookingDate: details.date,
        guests: Number(details.guests),
        days: Number(details.duration),
        totalPrice: calculateTotal(),
        paymentMethod: details.paymentMethod
      };

        await axios.post(`/api/bookings/create`, payload, {
          headers: { Authorization: token }
        });

      alert("Booking Confirmed Successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  // Check validity for button disable
  const isStep1Invalid = (type !== "Package" && !details.date) || 
                         errors.date || errors.guests || errors.duration;
  
  const isStep2Invalid = !details.accountNumber || !details.securityCode || 
                         errors.accountNumber || errors.securityCode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Book {type}</h3>
            <p className="text-slate-300 text-sm">{item.title || item.name || item.fullName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes size={20} /></button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            /* STEP 1: DETAILS */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  {type === "Package" ? "Start Date (Fixed)" : "Start Date"}
                </label>
                <input 
                  type="date" 
                  disabled={type === "Package"}
                  value={details.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className={`w-full p-3 bg-gray-50 rounded-xl text-sm border outline-none
                    ${errors.date ? "border-red-500 bg-red-50" : "focus:ring-2 focus:ring-blue-500"}`}
                />
                {errors.date && <p className="text-[10px] text-red-600 mt-1">{errors.date}</p>}
              </div>

              {type !== "Driver" && type !== "Guide" && (
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Number of Guests / Rooms</label>
                   <input 
                    type="number" min="1"
                    value={details.guests}
                    onChange={(e) => handleChange("guests", e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>
              )}

              {/* DURATION INPUT */}
              {(type === "Hotel" || type === "Driver" || type === "Guide") && (
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                     {type === "Driver" ? "Duration (Hours)" : "Duration (Days)"}
                   </label>
                   <input 
                    type="number" min="1"
                    value={details.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl text-sm border focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                   {type === "Driver" && <p className="text-xs text-orange-600 mt-1">Est. based on ~25km/hr.</p>}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center mt-4">
                <span className="font-bold text-blue-900">Total Price:</span>
                <span className="font-bold text-2xl text-blue-600">PKR {calculateTotal().toLocaleString()}</span>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={isStep1Invalid}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
            </div>
          ) : (
            /* STEP 2: PAYMENT */
            <form onSubmit={handleBooking} className="space-y-4">
              <p className="text-center text-gray-500 text-sm mb-2">Select a payment method.</p>
              
              <div className="grid grid-cols-3 gap-3">
                {["Credit/Debit Card", "JazzCash", "Easypaisa"].map(method => (
                  <div 
                    key={method}
                    onClick={() => {
                        setDetails({...details, paymentMethod: method, accountNumber: "", securityCode: ""}); // Reset fields on switch
                        setErrors({});
                    }}
                    className={`cursor-pointer p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition ${
                      details.paymentMethod === method ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-white text-gray-500"
                    }`}
                  >
                    {method.includes("Card") && <FaCreditCard size={20} />}
                    {method.includes("Jazz") && <FaMobileAlt size={20} />}
                    {method.includes("Easy") && <FaMoneyBillWave size={20} />}
                    <span className="text-[10px] font-bold text-center">{method}</span>
                  </div>
                ))}
              </div>

              {/* PAYMENT INPUTS */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-4 mt-2 border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    {details.paymentMethod === "Credit/Debit Card" ? "Card Number (16 Digits)" : "Mobile Number (11 Digits)"}
                  </label>
                  <input 
                    type="text" 
                    name="paymentField" // Anti-autofill
                    autoComplete="off"
                    placeholder={details.paymentMethod === "Credit/Debit Card" ? "0000 0000 0000 0000" : "0300 1234567"} 
                    className={`w-full p-2 bg-white rounded border text-sm outline-none 
                      ${errors.accountNumber ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"}`}
                    value={details.accountNumber}
                    onChange={(e) => handleChange("accountNumber", e.target.value)}
                    maxLength={details.paymentMethod === "Credit/Debit Card" ? 16 : 11}
                  />
                  {errors.accountNumber && <p className="text-[10px] text-red-600 mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    {details.paymentMethod === "Credit/Debit Card" ? "CVC / CVV" : "MPIN (4 Digit)"}
                  </label>
                  <input 
                    type="password" 
                    name="securityCode" // Anti-autofill
                    autoComplete="new-password"
                    placeholder="****" 
                    className={`w-full p-2 bg-white rounded border text-sm outline-none 
                      ${errors.securityCode ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"}`}
                    value={details.securityCode}
                    onChange={(e) => handleChange("securityCode", e.target.value)}
                    maxLength={4}
                  />
                  {errors.securityCode && <p className="text-[10px] text-red-600 mt-1">{errors.securityCode}</p>}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition">Back</button>
                <button 
                  type="submit" 
                  disabled={loading || isStep2Invalid}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Confirm & Pay"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;