import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PerformanceGaugeProps {
  value?: number;
}

const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({ value = 78 }) => {
  const data = [
    { name: 'filled', value },
    { name: 'empty', value: 100 - value },
  ];

  const colors = ['#6366f1', '#e5e7eb'];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Kitchen Efficiency</h3>
        <div className="flex items-center space-x-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <TrendingUp className="w-4 h-4" />
          <span>+5% this week</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              startAngle={180}
              endAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 text-center">
          <div className="text-4xl font-bold text-slate-900">{value}%</div>
          <p className="text-sm text-slate-500 mt-1">Target Achievement</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Average Time</span>
          <span className="font-semibold text-slate-900">12 min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Orders Today</span>
          <span className="font-semibold text-slate-900">45</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Success Rate</span>
          <span className="font-semibold text-slate-900">98%</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceGauge;