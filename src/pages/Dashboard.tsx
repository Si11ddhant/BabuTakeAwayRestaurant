import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, ShoppingCart, Star, Users, Clock } from 'lucide-react';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import PerformanceGauge from '@/components/PerformanceGauge';
import TopSellingItems from '@/components/TopSellingItems';

const Dashboard: React.FC = () => {
  const { orders, revenueData } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('7D');

  const monthlyData = [
    { month: 'Jan', revenue: 9200, gradient: 'from-purple-400 to-orange-400' },
    { month: 'Feb', revenue: 7800 },
    { month: 'Mar', revenue: 10600 },
    { month: 'Apr', revenue: 9800 },
    { month: 'May', revenue: 12500 },
    { month: 'Jun', revenue: 13200 },
  ];

  const timeRanges = ['1H', '1D', '7D', '1M', '1Y'];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's your restaurant performance.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* New Orders */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">New Orders</h3>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {orders.filter(o => o.status === 'New').length}
          </div>
          <p className="text-xs text-green-600 mt-2">+12% from yesterday</p>
        </div>

        {/* Pending Takeaways */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Pending Takeaways</h3>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {orders.filter(o => o.type === 'Takeaway' && o.status !== 'Dispatched').length}
          </div>
          <p className="text-xs text-green-600 mt-2">+5% this week</p>
        </div>

        {/* Total Reviews */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Total Reviews</h3>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">4.8</div>
          <p className="text-xs text-slate-500 mt-2">Out of 5.0</p>
        </div>

        {/* Active Tables */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Active Tables</h3>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <p className="text-xs text-slate-500 mt-2">Out of 20 tables</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Large Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Revenue Box */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Net Revenue</h2>
                  <p className="text-slate-500 text-sm mt-1">Total income this period</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">+12.5%</span>
                </div>
              </div>

              {/* Revenue Figure */}
              <div className="mb-8">
                <div className="text-5xl font-bold text-slate-900">$12,584</div>
                <p className="text-slate-500 text-sm mt-2">vs $11,200 last period</p>
              </div>

              {/* Time Range Filters */}
              <div className="flex space-x-3 mb-8">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedPeriod(range)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedPeriod === range
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Gradient Area Chart */}
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Table */}
          <RecentOrdersTable />
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-8">
          <PerformanceGauge value={78} />
          <TopSellingItems />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;