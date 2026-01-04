import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaThLarge, FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); 
    window.location.reload(); 
  };

  const getDashboardUrl = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "Admin": return "/admin/overview";
      case "TravelAgent": return "/agent/overview";
      case "HotelManager": return "/manager/overview";
      case "Driver": return "/driver/overview";
      case "Guide": return "/guide/overview";
      default: return "/customer/overview";
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition">P</div>
          <span className={`text-2xl font-bold tracking-tight transition ${scrolled ? "text-slate-900" : "text-white"}`}>Planora.</span>
        </Link>

        {/* UPDATED LINKS: Added "About" at the start */}
        <div className="hidden md:flex items-center gap-8">
          {["About", "Packages", "Hotels", "Drivers", "Guides"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className={`text-sm font-medium hover:text-blue-500 transition ${scrolled ? "text-slate-600" : "text-gray-200"}`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="relative">
          {user ? (
            <div>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-full transition-all border ${
                  scrolled ? "border-gray-200 hover:bg-gray-50 text-slate-800" : "border-white/20 hover:bg-white/10 text-white"
                }`}
              >
                <img src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} className="w-8 h-8 rounded-full object-cover border border-white/50" />
                <span className="text-sm font-semibold hidden md:block">{user.fullName.split(" ")[0]}</span>
                <FaChevronDown size={10} className="opacity-70" />
              </button>

              {/* HOMEPAGE DROPDOWN: Shows Dashboard & Logout */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>

                    <Link 
                      to={getDashboardUrl()} 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <FaThLarge className="text-gray-400" /> Dashboard
                    </Link>

                    <div className="border-t border-gray-50 my-1"></div>

                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${scrolled ? "text-slate-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}>Login</Link>
              <Link to="/register" className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold shadow hover:bg-gray-100 transition">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;