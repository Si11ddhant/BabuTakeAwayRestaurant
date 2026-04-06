import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const topSellingData = [
  { name: 'Paneer Tikka', sales: 120 },
  { name: 'Veg Biryani', sales: 98 },
  { name: 'Butter Chk', sales: 87 },
  { name: 'Veg Manchurian', sales: 76 },
  { name: 'Rolled Naan', sales: 65 },
];

const colors = ['#00D2FF', '#9D50BB', '#34d399', '#fb7185', '#fbbf24'];

const TopSellingItems: React.FC = () => {
  return (
    <div className="w-full space-y-8">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topSellingData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
              width={100} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B0E14',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
            />
            <Bar dataKey="sales" radius={[0, 10, 10, 0]} barSize={20}>
              {topSellingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 px-2">
        {topSellingData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 rounded-full transition-all duration-500 group-hover:h-10" style={{ backgroundColor: colors[index], boxShadow: `0 0 15px ${colors[index]}44` }} />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-widest">{item.name}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">Category Top Performer</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-white tracking-tighter">{item.sales}</span>
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Units Sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingItems;