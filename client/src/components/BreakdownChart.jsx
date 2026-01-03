import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BreakdownChart = ({ breakdown }) => {
  // Convert the breakdown object into an array for Recharts
  const data = [
    { name: 'Std Packages', value: breakdown.packages, color: '#4f46e5' },   // Indigo
    { name: 'Custom Pkgs', value: breakdown.customPackages, color: '#e11d48' }, // Rose
    { name: 'Hotels', value: breakdown.hotels, color: '#9333ea' },           // Purple
    { name: 'Drivers', value: breakdown.drivers, color: '#ea580c' },         // Orange
    { name: 'Guides', value: breakdown.guides || 0, color: '#0d9488' }       // Teal
  ].filter(item => item.value > 0); // Only show segments that have money

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // Makes it a Donut (Modern look)
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `PKR ${value.toLocaleString()}`}
            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            verticalAlign="middle" 
            align="right"
            layout="vertical" 
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BreakdownChart;