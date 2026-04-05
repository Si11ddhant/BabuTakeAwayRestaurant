import React from 'react';
import LiveOrdersFeed from '@/components/LiveOrdersFeed';
import { ShoppingBag, Clock, CheckCircle2, Bike, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";

const Orders = () => {
  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">Live Orders</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Real-time order management & tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-black text-slate-900 uppercase">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Incoming', value: '04', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Preparing', value: '02', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Ready', value: '01', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Dispatched', value: '08', icon: Bike, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Search by Order ID or Customer Name..." 
            className="h-12 pl-12 bg-slate-50 border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="h-12 w-[160px] bg-slate-50 border-transparent rounded-2xl font-bold text-xs uppercase tracking-widest focus:bg-white">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                <SelectValue placeholder="All Orders" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
              <SelectItem value="all" className="font-bold text-xs uppercase tracking-widest">All Orders</SelectItem>
              <SelectItem value="delivery" className="font-bold text-xs uppercase tracking-widest">Delivery</SelectItem>
              <SelectItem value="takeaway" className="font-bold text-xs uppercase tracking-widest">Takeaway</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1 h-6 bg-indigo-600 rounded-full" />
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Active Feed</h2>
        </div>
        <LiveOrdersFeed />
      </div>
    </div>
  );
};

export default Orders;
