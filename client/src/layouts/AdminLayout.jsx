import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaChartPie, FaUserTie, FaMapSigns, FaCar, FaHotel, FaUsers, FaUser, FaSignOutAlt, FaChevronDown 
} from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get user info from local storage (to show name/pic in top right)
  const user = JSON.parse(sessionStorage.getItem("user")) || { fullName: "Admin", profilePicture: "" };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Sidebar Link Component (Admin Theme: Slate)
  const NavItem = ({ to, icon: Icon, label }) => {
    const active = isActive(to);
    return (
      <Link 
        to={to} 
        className={`relative flex items-center gap-4 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl mx-2
        ${active 
          ? "bg-slate-700 text-white shadow-lg shadow-slate-900/20 translate-x-1" 
          : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
        }`}
      >
        <Icon size={16} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      
      {/* ------------------------------------------------------ */}
      {/* SIDEBAR (Admin Theme: Dark Slate #0F172A)              */}
      {/* ------------------------------------------------------ */}
      <div className="w-64 bg-[#0F172A] flex flex-col border-r border-slate-800 shrink-0 transition-all duration-300">
        
        {/* Logo Area */}
        <div className="p-8 pb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Planora.</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1 pb-4">
          <div className="px-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Analytics</div>
          <NavItem to="/admin/overview" icon={FaChartPie} label="Overview" />
          <div className="px-6 mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Management</div>
          <NavItem to="/admin/agents" icon={FaUserTie} label="Travel Agents" />
          <NavItem to="/admin/guides" icon={FaMapSigns} label="Tour Guides" />
          <NavItem to="/admin/drivers" icon={FaCar} label="Drivers" />
          <NavItem to="/admin/managers" icon={FaHotel} label="Hotel Managers" />
          <NavItem to="/admin/customers" icon={FaUsers} label="Customers" />

          <div className="px-6 mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Personal</div>
          <NavItem to="/admin/profile" icon={FaUser} label="My Profile" />
        </nav>
      </div>


      {/* ------------------------------------------------------ */}
      {/* MAIN CONTENT AREA                                      */}
      {/* ------------------------------------------------------ */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-8 shadow-sm z-10">
          
          {/* Page Title (Dynamic) */}
          <h2 className="text-lg font-semibold text-gray-700 capitalize">
             {location.pathname.split('/').pop().replace('-', ' ')}
          </h2>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors focus:outline-none"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-700">{user.fullName}</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <img 
                src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                alt="User" 
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
              <FaChevronDown className={`text-gray-400 text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* The Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in origin-top-right">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400 uppercase font-bold">Account</p>
                </div>
                <Link 
                  to="/admin/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <FaUser size={14} /> Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            )}
            
            {/* Click outside closer (Transparent background) */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
            )}
          </div>
        </header>


        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-[#F3F4F6]">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;