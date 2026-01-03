import React from "react";
import { 
  FaUserFriends, FaMoneyBillWave, FaMapMarkedAlt, FaHotel 
} from "react-icons/fa";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const AdminDashboard = () => {
  // Dummy Data for the Chart (We will replace this with real DB data later)
  const data = [
    { name: "Jan", earnings: 4000 },
    { name: "Feb", earnings: 3000 },
    { name: "Mar", earnings: 5000 },
    { name: "Apr", earnings: 2780 },
    { name: "May", earnings: 1890 },
    { name: "Jun", earnings: 2390 },
    { name: "Jul", earnings: 3490 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Super Admin. Here is what's happening today.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          {new Date().toDateString()}
        </div>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Earnings" 
          value="$120,450" 
          icon={FaMoneyBillWave} 
          color="bg-blue-600" 
          trend="+12%" 
        />
        <StatCard 
          title="Total Users" 
          value="1,240" 
          icon={FaUserFriends} 
          color="bg-purple-600" 
          trend="+5%" 
        />
        <StatCard 
          title="Active Packages" 
          value="45" 
          icon={FaMapMarkedAlt} 
          color="bg-emerald-500" 
          trend="+2" 
        />
        <StatCard 
          title="Hotel Partners" 
          value="89" 
          icon={FaHotel} 
          color="bg-orange-500" 
          trend="+8" 
        />
      </div>

      {/* 3. Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Earnings Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Analytics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12}} 
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recent Registrations (Mini List) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Requests</h3>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            {/* Dummy List Items */}
            <RequestItem name="Ahmed Ali" role="Travel Agent" time="2 mins ago" />
            <RequestItem name="Sara Khan" role="Tour Guide" time="1 hour ago" />
            <RequestItem name="Hotel One" role="Hotel Manager" time="3 hours ago" />
            <RequestItem name="Mike Ross" role="Driver" time="5 hours ago" />
            <RequestItem name="John Doe" role="Travel Agent" time="1 day ago" />
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">
            View All Requests
          </button>
        </div>

      </div>
    </div>
  );
};

// --- Reusable Sub-Components ---

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800 mt-2">{value}</h2>
      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2 inline-block">
        {trend} since last month
      </span>
    </div>
    <div className={`p-3 rounded-xl text-white ${color} shadow-lg shadow-opacity-20`}>
      <Icon size={20} />
    </div>
  </div>
);

const RequestItem = ({ name, role, time }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">
      {name.charAt(0)}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-gray-800">{name}</h4>
      <p className="text-xs text-gray-500">{role}</p>
    </div>
    <span className="text-[10px] text-gray-400 font-medium">{time}</span>
  </div>
);

export default AdminDashboard;