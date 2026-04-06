import React from 'react';
import LiveOrdersFeed from '@/components/LiveOrdersFeed';
import { ShoppingBag, Clock, CheckCircle2, Bike, Search, Filter, Activity, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const Orders = () => {
  return (
    <div className="space-y-10 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-electric-blue rounded-full shadow-[0_0_15px_#00D2FF]" />
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Live Control</h1>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity className="w-3 h-3 text-electric-blue animate-pulse" />
            Feed Status: <span className="text-emerald-500">Live Connection Active</span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 p-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 px-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Protocol</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Incoming', value: '04', icon: Zap, color: 'text-electric-blue', bg: 'bg-electric-blue/10', glow: 'shadow-[0_0_15px_#00D2FF44]' },
          { label: 'Preparing', value: '02', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', glow: 'shadow-[0_0_15px_#fbbf2444]' },
          { label: 'Ready', value: '01', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', glow: 'shadow-[0_0_15px_#34d39944]' },
          { label: 'Dispatched', value: '08', icon: Bike, color: 'text-slate-400', bg: 'bg-slate-400/10', glow: 'none' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-5 group hover:border-white/20 transition-all duration-500"
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border border-white/5",
              stat.bg,
              stat.color,
              stat.glow
            )}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter leading-none">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-6 bg-[#0B0E14]/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl"
      >
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-electric-blue transition-colors" />
          <Input 
            placeholder="FILTER BY PROTOCOL ID OR SUBJECT NAME..." 
            className="h-14 pl-14 bg-white/5 border-white/5 rounded-2xl font-black text-[10px] tracking-[0.1em] text-white uppercase placeholder-slate-700 focus:bg-white/10 focus:border-electric-blue/40 transition-all outline-none ring-0 focus-visible:ring-0"
          />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="h-14 w-[200px] bg-white/5 border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white focus:bg-white/10 focus:border-electric-blue/40 outline-none ring-0 focus:ring-0">
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-electric-blue" />
                <SelectValue placeholder="All Signals" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl bg-[#0B0E14] border-white/10 shadow-2xl">
              <SelectItem value="all" className="font-black text-[10px] uppercase tracking-widest text-slate-400 focus:text-white">All Signals</SelectItem>
              <SelectItem value="delivery" className="font-black text-[10px] uppercase tracking-widest text-slate-400 focus:text-white">Delivery</SelectItem>
              <SelectItem value="takeaway" className="font-black text-[10px] uppercase tracking-widest text-slate-400 focus:text-white">Takeaway</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Main Feed */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="w-1.5 h-6 bg-electric-blue rounded-full shadow-[0_0_10px_#00D2FF]" />
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Active Stream</h2>
        </div>
        <LiveOrdersFeed />
      </div>
    </div>
  );
};

export default Orders;