import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTrash, FaTimes, FaSearch } from "react-icons/fa";

const UserManagementTable = ({ role, title }) => {
  const [users, setUsers] = useState([]);
  
  // Requirement: Show "Approved" by default. 
  // Customers are always Approved, so this works for them too.
  const [filter, setFilter] = useState("Approved"); 

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`/api/admin/${role}`, {
        headers: { Authorization: token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`/api/admin/${id}/status`, { status }, {
        headers: { Authorization: token },
      });
      fetchUsers(); // Refresh
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/admin/${id}`, {
        headers: { Authorization: token },
      });
      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => u.isApproved === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        
        {/* Requirement: Hide Tabs for Customers (Only show for Staff) */}
        {role !== "Customer" && (
          <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
             {["Approved", "Pending"].map(status => (
               <button
                 key={status}
                 onClick={() => setFilter(status)}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                   filter === status ? "bg-slate-800 text-white shadow-md" : "text-gray-500 hover:text-gray-800"
                 }`}
               >
                 {status} ({users.filter(u => u.isApproved === status).length})
               </button>
             ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
           <div className="p-10 text-center text-gray-400">
             {role === "Customer" ? "No customers found." : `No ${filter.toLowerCase()} users found.`}
           </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                     <img src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                     {user.fullName}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.email}</td>
                  <td className="p-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {/* Specific Field Badges */}
                    {role === "TravelAgent" && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200">{user.assignedArea}</span>}
                    {role === "Driver" && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs border border-orange-200">{user.licenseNumber}</span>}
                    {role === "Guide" && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs border border-green-200">{user.language}</span>}
                    {role === "HotelManager" && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs border border-purple-200">{user.hotelName}</span>}
                    {role === "Customer" && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">{user.city}</span>}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {/* Only show Approve button if in Pending tab */}
                    {filter === "Pending" && role !== "Customer" && (
                      <button onClick={() => handleStatus(user._id, "Approved")} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Approve Request">
                        <FaCheck size={14}/>
                      </button>
                    )}
                    <button onClick={() => handleDelete(user._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Delete User">
                      <FaTrash size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagementTable;