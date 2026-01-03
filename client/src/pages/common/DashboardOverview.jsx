import { useState, useEffect } from "react";
import axios from "axios";
import { FaWallet, FaClipboardCheck, FaChartLine, FaCircle } from "react-icons/fa";
import StatCard from "../../components/StatCard";
import RevenueChart from "../../components/RevenueChart";
import BreakdownChart from "../../components/BreakdownChart";

const DashboardOverview = ({ colorType }) => {
  const [stats, setStats] = useState({ 
    totalEarnings: 0, 
    totalBookings: 0, 
    graphData: [],
    breakdown: null 
  });
  const [loading, setLoading] = useState(true);

  const isCustomer = colorType === "rose"; // Helper to check if Customer

  const colors = {
    blue: "bg-blue-600",
    indigo: "bg-indigo-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    teal: "bg-teal-600",
    rose: "bg-rose-600"
  };
  const hexColors = {
    blue: "#2563eb",
    indigo: "#4f46e5",
    purple: "#9333ea",
    orange: "#ea580c",
    teal: "#0d9488",
    rose: "#e11d48"
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("/api/stats/dashboard", {
          headers: { Authorization: token }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Analytics...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here is your {isCustomer ? "travel" : "financial"} summary.</p>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={isCustomer ? "Total Payments" : "Total Earnings"} // Dynamic Label
          value={`PKR ${stats.totalEarnings.toLocaleString()}`} 
          icon={FaWallet} 
          color={colors[colorType]} 
        />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={FaClipboardCheck} color={colors[colorType]} />
        <StatCard title="Active Performance" value="+24%" icon={FaChartLine} color="bg-green-500" />
      </div>

      {/* BREAKDOWN SECTION (Shown for Admin AND Customer now) */}
      {stats.breakdown && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
            {isCustomer ? "Expense Breakdown" : "Revenue Sources"} {/* Dynamic Title */}
          </h3>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full space-y-4">
               <BreakdownRow label="Standard Packages" amount={stats.breakdown.packages} color="text-indigo-600" />
               <BreakdownRow label="Custom Packages" amount={stats.breakdown.customPackages} color="text-rose-600" />
               <BreakdownRow label="Solo Hotels" amount={stats.breakdown.hotels} color="text-purple-600" />
               <BreakdownRow label="Solo Drivers" amount={stats.breakdown.drivers} color="text-orange-600" />
            </div>
            <div className="flex-1 w-full flex justify-center">
               <BreakdownChart breakdown={stats.breakdown} />
            </div>
          </div>
        </div>
      )}

      <RevenueChart data={stats.graphData} color={hexColors[colorType]} />
    </div>
  );
};

const BreakdownRow = ({ label, amount, color }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      <FaCircle className={`text-[8px] ${color}`} />
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className={`font-bold ${color}`}>PKR {amount.toLocaleString()}</span>
  </div>
);

export default DashboardOverview;