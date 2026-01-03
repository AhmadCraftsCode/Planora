import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaCalendarAlt } from "react-icons/fa";

const DriverBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("/api/bookings/service-bookings", {
          headers: { Authorization: token }
        });
        setBookings(res.data);
      } catch (err) { console.error(err); }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trip Schedule</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-orange-50 border-b border-orange-100 text-xs font-bold text-orange-800 uppercase">
            <tr>
              <th className="p-4">Booking Source</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Date & Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length > 0 ? bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="p-4">
                  {b.origin === "Package" ? (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold border border-indigo-200">
                      📦 Package: {b.packageName}
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
                      👤 Direct Booking
                    </span>
                  )}
                </td>
                <td className="p-4 flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><FaUser size={12}/></div>
                   <span className="text-sm font-bold text-gray-700">{b.customerId?.fullName}</span>
                </td>
                <td className="p-4 text-sm text-gray-500"><FaPhone className="inline mr-1 text-xs"/> {b.customerId?.phone}</td>
                <td className="p-4 text-sm">
                   <div className="flex flex-col">
                     <span className="font-bold flex items-center gap-1"><FaCalendarAlt className="text-orange-500"/> {new Date(b.bookingDate).toDateString()}</span>
                     <span className="text-xs text-gray-500 mt-1">
                       {b.origin === "Package" ? `Full Tour` : `${b.days} Hours`}
                     </span>
                   </div>
                </td>
              </tr>
            )) : <tr><td colSpan="4" className="p-10 text-center text-gray-400">No trips scheduled.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverBookings;