import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Star, Users, Clock, 
  ArrowUpRight, ArrowDownRight, IndianRupee,
  ChefHat, Zap, Target, Activity
} from 'lucide-react';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import PerformanceGauge from '@/components/PerformanceGauge';
import TopSellingItems from '@/components/TopSellingItems';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { orders, revenueData } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('7D');

  const monthlyData = [
    { name: 'Mon', revenue: 4200, orders: 45 },
    { name: 'Tue', revenue: 3800, orders: 38 },
    { name: 'Wed', revenue: 5600, orders: 52 },
    { name: 'Thu', revenue: 4800, orders: 48 },
    { name: 'Fri', revenue: 7500, orders: 65 },
    { name: 'Sat', revenue: 9200, orders: 82 },
    { name: 'Sun', revenue: 8800, orders: 78 },
  ];

  const categoryData = [
    { name: 'Biryani', value: 45, color: '#6366f1' },
    { name: 'Starters', value: 25, color: '#a855f7' },
    { name: 'Main Course', value: 20, color: '#ec4899' },
    { name: 'Others', value: 10, color: '#f43f5e' },
  ];

  const timeRanges = ['1H', '1D', '7D', '1M', '1Y'];

  const stats = [
    { 
      label: 'Net Revenue', 
      value: '₹1,24,584', 
      trend: '+12.5%', 
      trendUp: true, 
      icon: IndianRupee,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    { 
      label: 'Total Orders', 
      value: orders.length.toString(), 
      trend: '+8.2%', 
      trendUp: true, 
      icon: ShoppingBag,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    { 
      label: 'Average Rating', 
      value: '4.8', 
      trend: '+0.2', 
      trendUp: true, 
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    { 
      label: 'New Customers', 
      value: '124', 
      trend: '-2.4%', 
      trendUp: false, 
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">Dashboard</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            Live Restaurant Performance Overview
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedPeriod(range)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                selectedPeriod === range
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={stat.label} 
            className={cn(
              "bg-white rounded-[2rem] border p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 group",
              stat.border
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 pb-0">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Revenue Analytics</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Daily income and order volume</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-200" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Orders</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[350px] p-4 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '1.5rem', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#e2e8f0" 
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col">
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">Order Breakdown</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Sales by category</p>
          
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 tracking-tighter">85%</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth</span>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{cat.name}</span>
                </div>
                <span className="text-[10px] font-black text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Other Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ChefHat className="w-32 h-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight">Kitchen Efficiency</h3>
              <p className="text-indigo-100 text-xs font-medium uppercase tracking-widest mt-2 opacity-80">Current prep time: 18 mins</p>
              <div className="mt-8 space-y-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[78%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Efficiency Level</span>
                  <span>78%</span>
                </div>
              </div>
            </div>
          </div>
          <TopSellingItems />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;