import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartPie, FaSuitcase, FaUser, FaSignOutAlt, FaChevronDown, FaHome } from "react-icons/fa";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get User Data
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")) || { fullName: "Customer", role: "Customer" });

  useEffect(() => {
    const handleUserUpdate = () => setUser(JSON.parse(sessionStorage.getItem("user")));
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); // Redirect to Homepage on logout
  };

  const isActive = (path) => location.pathname === path;

  // Sidebar Link - Rose Theme
  const NavItem = ({ to, icon: Icon, label }) => {
    const active = isActive(to);
    return (
      <Link to={to} className={`relative flex items-center gap-4 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl mx-2
        ${active 
          ? "bg-rose-700 text-white shadow-lg translate-x-1" 
          : "text-rose-100 hover:bg-rose-800 hover:text-white"}`}>
        <Icon size={16} /> <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      
      {/* SIDEBAR - Rose #be123c */}
      <div className="w-64 bg-[#be123c] flex flex-col border-r border-rose-900 shrink-0">
        <div className="p-8 pb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Planora.</h1>
          <p className="text-rose-200 text-xs font-medium uppercase tracking-wide mt-1">Customer Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar space-y-1 pb-4">
          <NavItem to="/customer/overview" icon={FaChartPie} label="Overview" />
          <NavItem to="/customer/bookings" icon={FaSuitcase} label="My Bookings" />
          <NavItem to="/customer/profile" icon={FaUser} label="My Profile" />
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 capitalize">{location.pathname.split('/').pop().replace('-', ' ')}</h2>
          
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-rose-900">Customer</p>
                <p className="text-xs text-gray-500 font-medium">{user.fullName}</p>
              </div>
              <img src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} className="w-10 h-10 rounded-full object-cover border border-rose-200" />
              <FaChevronDown className={`text-gray-400 text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* --- THIS IS THE DROPDOWN SECTION YOU ASKED FOR --- */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in origin-top-right">
                 <div className="px-4 py-2 border-b border-gray-50 mb-1">
                   <p className="text-xs text-gray-400 uppercase font-bold">Account</p>
                 </div>
                 
                 {/* 1. HOMEPAGE OPTION (Added) */}
                 <Link 
                   to="/" 
                   className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                 >
                   <FaHome size={14} /> Homepage
                 </Link>

                 {/* 2. LOGOUT OPTION */}
                 <button 
                   onClick={handleLogout} 
                   className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                 >
                   <FaSignOutAlt size={14} /> Logout
                 </button>
              </div>
            )}
            {/* ------------------------------------------------ */}

            {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-[#F3F4F6]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;