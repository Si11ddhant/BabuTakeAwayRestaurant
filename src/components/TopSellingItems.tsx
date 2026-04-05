import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const topSellingData = [
  { name: 'Paneer Tikka', sales: 120, gradient: 'from-purple-400 to-purple-600' },
  { name: 'Veg Biryani', sales: 98, gradient: 'from-blue-400 to-blue-600' },
  { name: 'Butter Chk', sales: 87, gradient: 'from-orange-400 to-orange-600' },
  { name: 'Veg Manchurian', sales: 76, gradient: 'from-pink-400 to-pink-600' },
  { name: 'Rolled Naan', sales: 65, gradient: 'from-green-400 to-green-600' },
];

const colors = ['#c084fc', '#60a5fa', '#fb923c', '#ec4899', '#4ade80'];

const TopSellingItems: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Top Selling Items</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={topSellingData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" width={95} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
          <Bar dataKey="sales" fill="#6366f1" radius={[0, 12, 12, 0]}>
            {topSellingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        {topSellingData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[index] }} />
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900">{item.sales} sold</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingItems;