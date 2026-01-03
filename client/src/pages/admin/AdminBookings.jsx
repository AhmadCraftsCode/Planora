import { useState, useEffect } from "react";
import axios from "axios";
import { FaBox, FaPhone, FaUsers } from "react-icons/fa";

const AgentBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        // This endpoint ALREADY filters by the logged-in agent's packages on the backend
        const res = await axios.get("/api/bookings/agent-bookings", {
          headers: { Authorization: token }
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Package Bookings</h1>
        <p className="text-sm text-gray-500">View customers who have booked your tours.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-indigo-50 border-b border-indigo-100 text-xs font-bold text-indigo-800 uppercase">
            <tr>
              <th className="p-4">Package Name</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Contact</th>
              <th className="p-4 text-center">Seats Booked</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length > 0 ? bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <FaBox />
                  </div>
                  <div>
                    <p>{b.itemId?.title || "Unknown Package"}</p>
                    {/* Note: To show 'Seats Left', we would need the Package object to calculate (Total - Booked). 
                        For now, showing how many seats THIS booking took. */}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <img src={b.customerId?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} className="w-8 h-8 rounded-full border border-gray-200" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{b.customerId?.fullName}</p>
                      <p className="text-xs text-gray-400">{b.customerId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">
                   <div className="flex items-center gap-1"><FaPhone className="text-[10px]"/> {b.customerId?.phone}</div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                    <FaUsers className="text-gray-400"/> {b.guests}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-green-600">Rs. {b.totalPrice.toLocaleString()}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-green-200">
                    Confirmed
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="p-10 text-center text-gray-400">No bookings found for your packages.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentBookings;