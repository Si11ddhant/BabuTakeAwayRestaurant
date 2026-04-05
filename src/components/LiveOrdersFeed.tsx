import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  Clock, MapPin, Phone, User, ChevronRight, 
  Loader2, Package, CheckCircle2, AlertCircle,
  Timer, IndianRupee, Bike, ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  order_type: 'delivery' | 'takeaway';
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'dispatched';
  total_amount: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  created_at: string;
  updated_at?: string;
}

type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'dispatched';

const STATUS_FLOW: OrderStatus[] = ['new', 'accepted', 'preparing', 'ready', 'dispatched'];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  new: { label: 'New Order', color: 'text-blue-600', bg: 'bg-blue-50', icon: AlertCircle },
  accepted: { label: 'Accepted', color: 'text-purple-600', bg: 'bg-purple-50', icon: CheckCircle2 },
  preparing: { label: 'Preparing', color: 'text-orange-600', bg: 'bg-orange-50', icon: Timer },
  ready: { label: 'Ready', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Package },
  dispatched: { label: 'Dispatched', color: 'text-slate-600', bg: 'bg-slate-50', icon: Bike },
};

const LiveOrdersFeed: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            setOrders(prev => [newOrder, ...prev]);
            toast.info(`New order from ${newOrder.customer_name}!`, {
              icon: <ShoppingBag className="w-4 h-4 text-indigo-600" />,
            });
            // Play sound notification if possible
            try {
              const audio = new Audio('/order-alert.mp3');
              audio.play();
            } catch (e) {}
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev =>
              prev.map(order => order.id === payload.new.id ? payload.new as Order : order)
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order marked as ${STATUS_CONFIG[newStatus].label}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    return currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <Package className="w-5 h-5 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Loading Live Feed...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">No Active Orders</h3>
        <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">New orders will appear here in real-time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order) => {
        const nextStatus = getNextStatus(order.status);
        const config = STATUS_CONFIG[order.status];
        const StatusIcon = config.icon;

        return (
          <div
            key={order.id}
            className={cn(
              'group bg-white rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col overflow-hidden',
              order.status === 'new' ? 'border-blue-200 shadow-lg shadow-blue-100/50 ring-4 ring-blue-50' : 'border-slate-100'
            )}
          >
            {/* Order Header */}
            <div className={cn('p-6 flex items-center justify-between border-b border-slate-50', config.bg)}>
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-sm', order.status === 'new' ? 'bg-white' : 'bg-white/50')}>
                  <StatusIcon className={cn('w-5 h-5', config.color)} />
                </div>
                <div>
                  <h4 className={cn('text-xs font-black uppercase tracking-widest', config.color)}>
                    {config.label}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                    Order #{order.id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-slate-900 justify-end">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-black tabular-nums">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={cn(
                  "text-[9px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full inline-block",
                  order.order_type === 'delivery' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"
                )}>
                  {order.order_type}
                </div>
              </div>
            </div>

            {/* Customer & Items */}
            <div className="p-6 flex-1 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{order.customer_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest">{order.customer_phone}</p>
                  </div>
                </div>
                {order.customer_address && (
                  <div className="flex items-start gap-3 pl-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-300 mt-1 shrink-0" />
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                      {order.customer_address}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-4 space-y-3 border border-slate-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Items</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</span>
                </div>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center group/item">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-tight group-hover/item:text-indigo-600 transition-colors">{item.name}</span>
                      <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg shadow-sm">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer & Actions */}
            <div className="p-6 pt-0 mt-auto">
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Amount</span>
                <span className="text-xl font-black text-slate-900 tracking-tighter">₹{order.total_amount}</span>
              </div>

              {nextStatus ? (
                <Button
                  onClick={() => updateOrderStatus(order.id, nextStatus)}
                  disabled={updating === order.id}
                  className={cn(
                    "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3",
                    order.status === 'new' ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" : 
                    "bg-slate-900 hover:bg-black text-white shadow-slate-900/20"
                  )}
                >
                  {updating === order.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Mark as {STATUS_CONFIG[nextStatus].label}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <div className="h-14 bg-emerald-50 rounded-2xl flex items-center justify-center gap-2 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Order Completed</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveOrdersFeed;
