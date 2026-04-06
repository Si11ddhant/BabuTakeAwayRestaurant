import React, { useState } from 'react';
import { useAdmin, Order } from '@/context/AdminContext';
import { ChevronDown, MapPin, Package, User, PoundSterling, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  'new': { color: 'text-electric-blue', bg: 'bg-electric-blue/10', border: 'border-electric-blue/20', glow: 'shadow-[0_0_10px_rgba(0,210,255,0.3)]' },
  'accepted': { color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20', glow: 'shadow-[0_0_10px_rgba(157,80,187,0.3)]' },
  'preparing': { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.3)]' },
  'ready': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.3)]' },
  'dispatched': { color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', glow: 'none' },
};

interface DisplayOrder extends Order {
  itemName?: string;
}

const RecentOrdersTable: React.FC = () => {
  const { orders, updateOrderStatus, loading } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-20 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue mx-auto"></div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-4">Loading Signal Feed...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-20 text-center">
        <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No active transmissions found</p>
      </div>
    );
  }

  const displayOrders: DisplayOrder[] = orders.map(order => ({
    ...order,
    itemName: (order.items && order.items[0]?.name) || 'N/A',
  }));

  const totalPages = Math.ceil(displayOrders.length / itemsPerPage);
  const paginatedOrders = displayOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setExpandedOrder(null);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
              <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Customer / Item</th>
              <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Protocol ID</th>
              <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Value</th>
              <th className="text-left py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Modality</th>
              <th className="text-right py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedOrders.map((order) => {
              const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig['New'];
              return (
                <tr key={order.id} className="group hover:bg-white/5 transition-all duration-300">
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-white">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs font-black tracking-tighter">
                          {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1 ml-4">
                        {order.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white tracking-tight uppercase group-hover:text-electric-blue transition-colors">
                          {order.customerName || 'Anonymous'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 line-clamp-1 italic">
                          {order.itemName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <code className="text-[10px] font-black text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5 uppercase tracking-tighter">
                      #{order.id.slice(0, 12)}
                    </code>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-1">
                      <PoundSterling className="w-3 h-3 text-emerald-400" />
                      <span className="text-sm font-black text-white tracking-tighter">{order.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      order.type === 'Delivery' 
                        ? "text-electric-blue bg-electric-blue/10 border-electric-blue/20" 
                        : "text-neon-purple bg-neon-purple/10 border-neon-purple/20"
                    )}>
                      {order.type === 'Delivery' ? <MapPin className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                      {order.type}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex justify-end">
                      <div className="relative">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-300",
                            config.color,
                            config.bg,
                            config.border,
                            config.glow
                          )}
                        >
                          {order.status}
                          <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", expandedOrder === order.id && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                          {expandedOrder === order.id && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 mt-3 w-48 bg-[#0B0E14] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-2xl"
                            >
                              {(['New', 'Accepted', 'Preparing', 'Ready for Pickup', 'Dispatched'] as Order['status'][]).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(order.id, status)}
                                  className="w-full text-left px-5 py-4 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 text-slate-500 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                >
                                  {status}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Futuristic Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-8 border-t border-white/5">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Showing <span className="text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * itemsPerPage, orders.length)}</span> of <span className="text-white">{orders.length}</span> units
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all",
                  currentPage === page
                    ? "bg-electric-blue text-white shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                    : "bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;