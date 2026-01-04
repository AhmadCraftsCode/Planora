import { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaMoneyBillWave, FaTimesCircle, FaTrash } from "react-icons/fa";

const MyBookings = () => {
  const [filter, setFilter] = useState("All");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Changed to session per previous fix
      const res = await axios.get("/api/bookings/my-bookings", {
        headers: { Authorization: token }
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Logic to Cancel
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`/api/bookings/cancel/${id}`, {}, {
        headers: { Authorization: token }
      });
      fetchBookings();
      alert("Booking Cancelled");
    } catch (err) {
      alert("Failed to cancel");
    }
  };

  // Logic to Delete (Remove from view)
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this from your history?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/bookings/${id}`, {
        headers: { Authorization: token }
      });
      fetchBookings(); // Refresh list
    } catch (err) {
      alert("Failed to remove");
    }
  };

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.bookingType === filter);

  return (
    <div>
      {/* ... Title & Filters Code (Keep Same) ... */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-sm text-gray-500">Track your upcoming and past trips.</p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
        {["All", "Package", "Hotel", "Driver", "Guide"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === tab 
                ? "bg-rose-600 text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-50 hover:text-rose-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? filtered.map(b => (
          <div key={b._id} className={`bg-white rounded-xl shadow-sm border overflow-hidden p-5 transition relative ${b.status === "Cancelled" ? "opacity-75 border-red-100" : "border-gray-200 hover:shadow-md"}`}>
            
            <div className="flex justify-between items-start mb-2">
               <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                 b.bookingType === "Package" ? "bg-indigo-600" : b.bookingType === "Hotel" ? "bg-purple-600" : "bg-orange-600"
               }`}>{b.bookingType}</span>
               
               <span className={`text-xs font-bold uppercase ${
                 b.status === "Cancelled" ? "text-red-500" : "text-green-600"
               }`}>
                 ● {b.status}
               </span>
            </div>
            
            <h3 className="font-bold text-gray-800 text-lg mb-4 line-clamp-1">
              {b.itemId ? (
                 b.itemModel === "Package" ? b.itemId.title : 
                 b.itemModel === "Hotel" ? b.itemId.name : 
                 b.itemId.fullName
              ) : <span className="text-red-400 italic">Item Unavailable</span>}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
               <div className="flex items-center gap-2"><FaCalendarAlt className="text-rose-500"/> {new Date(b.bookingDate).toDateString()}</div>
               <div className="flex items-center gap-2"><FaMoneyBillWave className="text-green-500"/> PKR {b.totalPrice.toLocaleString()}</div>
            </div>

            {/* BUTTONS LOGIC */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {b.status === "Cancelled" ? (
                // SHOW DELETE BUTTON IF CANCELLED
                <button 
                  onClick={() => handleDelete(b._id)}
                  className="w-full flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 py-2 rounded-lg text-sm font-bold transition"
                >
                  <FaTrash /> Remove from History
                </button>
              ) : (
                // SHOW CANCEL BUTTON IF ACTIVE
                <button 
                  onClick={() => handleCancel(b._id)}
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-bold transition"
                >
                  <FaTimesCircle /> Cancel Booking
                </button>
              )}
            </div>

          </div>
        )) : (
          <div className="col-span-3 text-center py-10 text-gray-400">No bookings found.</div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;