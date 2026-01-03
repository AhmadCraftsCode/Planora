import { useState, useEffect } from "react";
import axios from "axios";
import { FaBox, FaPhone, FaUsers } from "react-icons/fa";

const AgentBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("/api/bookings/agent-bookings", {
          headers: { Authorization: token }
        });
        setBookings(res.data);
      } catch (err) { console.error(err); }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Package Bookings</h1>
        <p className="text-sm text-gray-500">Track customers and remaining availability.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-indigo-50 border-b border-indigo-100 text-xs font-bold text-indigo-800 uppercase">
            <tr>
              <th className="p-4">Package Details</th>
              <th className="p-4">Customer Info</th>
              <th className="p-4 text-center">Booking Size</th>
              <th className="p-4 text-center">Availability</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length > 0 ? bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FaBox /></div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{b.itemId?.title}</p>
                      <p className="text-xs text-gray-500">{b.itemId?.duration} Days Tour</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={b.customerId?.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{b.customerId?.fullName}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500"><FaPhone size={10}/> {b.customerId?.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                    <FaUsers className="text-gray-400"/> {b.guests} Guests
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-bold ${b.seatsLeft < 5 ? "text-red-500" : "text-green-600"}`}>
                      {b.seatsLeft} Left
                    </span>
                    <span className="text-[10px] text-gray-400">out of {b.itemId?.seats}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wide">{b.status}</span>
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="p-10 text-center text-gray-400">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentBookings;