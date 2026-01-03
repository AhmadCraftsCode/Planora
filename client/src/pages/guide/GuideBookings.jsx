import { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";

const GuideBookings = () => {
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Assigned Tours</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-teal-50 border-b border-teal-100 text-xs font-bold text-teal-800 uppercase">
            <tr>
              <th className="p-4">Tour Type</th>
              <th className="p-4">Customer/Group</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length > 0 ? bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="p-4">
                  {b.origin === "Package" ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-teal-700">{b.packageName}</span>
                      <span className="text-[10px] text-gray-500">Package Tour</span>
                    </div>
                  ) : (
                    <span className="font-bold text-gray-700">Private Guide Service</span>
                  )}
                </td>
                <td className="p-4">
                   <div className="flex flex-col">
                     <span className="font-bold text-sm">{b.customerId?.fullName}</span>
                     <span className="text-xs text-gray-500">{b.customerId?.phone}</span>
                   </div>
                </td>
                <td className="p-4 text-sm font-bold text-gray-600">
                   <FaCalendarAlt className="inline mr-2 text-teal-500"/>
                   {new Date(b.bookingDate).toDateString()}
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Confirmed</span>
                </td>
              </tr>
            )) : <tr><td colSpan="4" className="p-10 text-center text-gray-400">No tours assigned.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuideBookings;