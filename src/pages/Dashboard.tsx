import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Star, Users, Clock, 
  ArrowUpRight, ArrowDownRight, PoundSterling,
  ChefHat, Zap, Target, Activity, MoreHorizontal,
  Wallet, PieChart as PieChartIcon, Calendar
} from 'lucide-react';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import PerformanceGauge from '@/components/PerformanceGauge';
import TopSellingItems from '@/components/TopSellingItems';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { orders } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('7D');

  const performanceData = [
    { name: '01', sales: 4200, orders: 45 },
    { name: '02', sales: 3800, orders: 38 },
    { name: '03', sales: 5600, orders: 52 },
    { name: '04', sales: 4800, orders: 48 },
    { name: '05', sales: 7500, orders: 65 },
    { name: '06', sales: 9200, orders: 82 },
    { name: '07', sales: 8800, orders: 78 },
    { name: '08', sales: 9500, orders: 85 },
    { name: '09', sales: 11000, orders: 95 },
    { name: '10', sales: 10500, orders: 90 },
  ];

  const totalRevenue = useMemo(() => 
    orders.reduce((acc, order) => acc + (order.total || 0), 0),
    [orders]
  );

  const avgOrderValue = useMemo(() => 
    orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
    [totalRevenue, orders.length]
  );

  const stats = [
    { 
      label: 'Net Revenue', 
      value: `£${totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, 
      trend: '+12.5%', 
      trendUp: true, 
      icon: Wallet,
      color: 'text-electric-blue',
      chartColor: '#00D2FF',
      data: [30, 45, 32, 50, 40, 65, 55]
    },
    { 
      label: 'Total Orders', 
      value: orders.length.toString(), 
      trend: '+8.2%', 
      trendUp: true, 
      icon: ShoppingBag,
      color: 'text-neon-purple',
      chartColor: '#9D50BB',
      data: [20, 35, 25, 45, 35, 55, 48]
    },
    { 
      label: 'Avg Order Value', 
      value: `£${avgOrderValue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, 
      trend: '+4.3%', 
      trendUp: true, 
      icon: Target,
      color: 'text-emerald-400',
      chartColor: '#34d399',
      data: [40, 42, 38, 45, 44, 48, 46]
    },
    { 
      label: 'New Customers', 
      value: '124', 
      trend: '-2.4%', 
      trendUp: false, 
      icon: Users,
      color: 'text-rose-400',
      chartColor: '#fb7185',
      data: [15, 22, 18, 25, 20, 18, 16]
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-electric-blue rounded-full shadow-[0_0_15px_#00D2FF]" />
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Operations Hub</h1>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity className="w-3 h-3 text-electric-blue animate-pulse" />
            System Status: <span className="text-emerald-500">Optimal Performance</span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl"
        >
          {['1D', '7D', '1M', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedPeriod(range)}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                selectedPeriod === range
                  ? "bg-electric-blue text-white shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              {range}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden hover:border-white/20 transition-all duration-500"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                  stat.trendUp ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                )}>
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
              </div>

              <div className="mt-auto h-16 -mx-8 -mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stat.data.map((v, i) => ({ v, i }))}>
                    <defs>
                      <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stat.chartColor} stopOpacity={0.2}/>
                        <stop offset="100%" stopColor={stat.chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="v" 
                      stroke={stat.chartColor} 
                      strokeWidth={2} 
                      fill={`url(#gradient-${i})`}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-64 h-64 text-electric-blue" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Sales Performance</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Real-time revenue & velocity tracking</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00D2FF]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_#9D50BB]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Orders</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9D50BB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#9D50BB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B0E14', 
                    borderRadius: '1.5rem', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    padding: '1.5rem'
                  }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#00D2FF" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#9D50BB" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-white tracking-tighter uppercase">Distribution</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Category breakdown</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-neon-purple" />
          </div>
          
          <div className="flex-1 relative min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Biryani', value: 45, color: '#00D2FF' },
                    { name: 'Starters', value: 25, color: '#9D50BB' },
                    { name: 'Main', value: 20, color: '#34d399' },
                    { name: 'Others', value: 10, color: '#fb7185' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {[
                    { color: '#00D2FF' },
                    { color: '#9D50BB' },
                    { color: '#34d399' },
                    { color: '#fb7185' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-white tracking-tighter">85%</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { label: 'Biryani', color: 'bg-electric-blue', val: '45%' },
              { label: 'Starters', color: 'bg-neon-purple', val: '25%' },
              { label: 'Main', color: 'bg-emerald-400', val: '20%' },
              { label: 'Others', color: 'bg-rose-400', val: '10%' },
            ].map((cat) => (
              <div key={cat.label} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.label}</span>
                </div>
                <span className="text-[10px] font-black text-white">{cat.val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tighter uppercase">Recent Activity</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Live transaction monitoring</p>
              </div>
              <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <RecentOrdersTable />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-8"
        >
          <div className="relative group overflow-hidden bg-gradient-to-br from-electric-blue to-neon-purple rounded-[3rem] p-10 text-white shadow-[0_20px_50px_rgba(0,210,255,0.2)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700">
              <ChefHat className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl">
                <Zap className="w-7 h-7 text-white fill-white" />
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">Kitchen Velocity</h3>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Prep Efficiency Index</p>
              <div className="mt-10 space-y-4">
                <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-white/60">Load Level</span>
                  <span className="text-white">78%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xl font-black text-white tracking-tighter uppercase">Hot Items</h3>
              <Calendar className="w-4 h-4 text-slate-500" />
            </div>
            <TopSellingItems />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;