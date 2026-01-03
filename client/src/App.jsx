import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Public
import Home from "./pages/Home";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import AgentLayout from "./layouts/AgentLayout";
import DriverLayout from "./layouts/DriverLayout";
import GuideLayout from "./layouts/GuideLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Shared Pages
import AdminProfile from "./pages/admin/AdminProfile";
import UserManagementTable from "./components/UserManagementTable";
import ManagerBookings from "./pages/manager/ManagerBookings";
import DriverBookings from "./pages/driver/DriverBookings";
import GuideBookings from "./pages/guide/GuideBookings";
import DashboardOverview from "./pages/common/DashboardOverview";
import CustomPackage from "./pages/customer/CustomPackage";

// Admin Specific
import AdminBookings from "./pages/admin/AdminBookings";

// Agent Specific
import ManagePackages from "./pages/agent/ManagePackages";
import AgentBookings from "./pages/agent/AgentBookings"; // <--- THIS IS THE FIX

// Manager Specific
import MyHotel from "./pages/manager/MyHotel";

// Customer Specific
import MyBookings from "./pages/customer/MyBookings";

// Placeholder Component (For Overview tabs mainly)
const Overview = ({ text }) => (
  <div className="flex flex-col items-center justify-center h-full mt-20">
    <h2 className="text-2xl font-bold text-gray-300">Coming Soon</h2>
    <p className="text-gray-500 mt-2">{text}</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ================= ADMIN SECTION ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview colorType="blue" />} />  
          
          {/* User Management */}
          <Route path="agents" element={<UserManagementTable role="TravelAgent" title="Manage Travel Agents" />} />
          <Route path="guides" element={<UserManagementTable role="Guide" title="Manage Tour Guides" />} />
          <Route path="drivers" element={<UserManagementTable role="Driver" title="Manage Drivers" />} />
          <Route path="managers" element={<UserManagementTable role="HotelManager" title="Manage Hotel Managers" />} />
          <Route path="customers" element={<UserManagementTable role="Customer" title="Manage Customers" />} />
          
          {/* Admin sees ALL Package Bookings */}
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>


        {/* ================= AGENT SECTION ================= */}
        <Route path="/agent" element={<AgentLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview colorType="indigo" />} />
          
          <Route path="packages" element={<ManagePackages />} />
          
          {/* FIX: This now points to the real file, not the placeholder */}
          <Route path="bookings" element={<AgentBookings />} /> 
          
          <Route path="profile" element={<AdminProfile />} />
        </Route>


        {/* ================= MANAGER SECTION ================= */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview colorType="purple" />} /> 
          <Route path="my-hotel" element={<MyHotel />} />
          <Route path="bookings" element={<ManagerBookings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>


        {/* ================= DRIVER SECTION ================= */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview colorType="orange" />} />
          <Route path="bookings" element={<DriverBookings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>


        {/* ================= GUIDE SECTION ================= */}
        <Route path="/guide" element={<GuideLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
         <Route path="overview" element={<DashboardOverview colorType="teal" />} />
          <Route path="bookings" element={<GuideBookings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>


        {/* ================= CUSTOMER SECTION ================= */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview colorType="rose" />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="create-custom" element={<CustomPackage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;