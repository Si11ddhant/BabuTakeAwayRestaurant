import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Phone,
  User,
  ChevronRight,
  Loader2,
  Package,
  CheckCircle2,
  AlertCircle,
  Timer,
  Bike,
  ShoppingBag,
  Zap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  order_type: "delivery" | "takeaway";
  status: OrderStatus;
  total_amount: number;
  items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
  }>;
  created_at: string;
  updated_at?: string;
  order_payload?: Record<string, unknown>;
}

type OrderStatus = "new" | "accepted" | "preparing" | "ready" | "dispatched";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; glow: string; icon: React.ComponentType<{ className?: string }> }
> = {
  new: { label: "Incoming", color: "text-electric-blue", glow: "shadow-[0_0_15px_#00D2FF]", icon: Zap },
  accepted: { label: "Confirmed", color: "text-neon-purple", glow: "shadow-[0_0_15px_#9D50BB]", icon: CheckCircle2 },
  preparing: { label: "In Kitchen", color: "text-amber-400", glow: "shadow-[0_0_15px_#fbbf24]", icon: Timer },
  ready: { label: "Ready", color: "text-emerald-400", glow: "shadow-[0_0_15px_#34d399]", icon: Package },
  dispatched: { label: "Dispatched", color: "text-slate-500", glow: "shadow-none", icon: Bike },
};

const nextActionLabel: Partial<Record<OrderStatus, string>> = {
  new: "Accept Order",
  accepted: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Dispatch Now",
};

const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  if (current === "new") return "accepted";
  if (current === "accepted") return "preparing";
  if (current === "preparing") return "ready";
  if (current === "ready") return "dispatched";
  return null;
};

const LIVE_FEED_TTL_MS = 10000;

const LiveOrdersFeed: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [freshIds, setFreshIds] = useState<Set<string>>(() => new Set());

  const markFresh = useCallback((id: string) => {
    setFreshIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      setFreshIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, LIVE_FEED_TTL_MS);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!cancelled) setOrders((data || []) as Order[]);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel("public:orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => {
            if (prev.some((o) => o.id === newOrder.id)) return prev;
            return [newOrder, ...prev];
          });
          markFresh(newOrder.id);
          toast.success("New Order Protocol Initiated", {
            description: `${newOrder.customer_name} · £${newOrder.total_amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
            duration: 10000,
          });
          try {
            const audio = new Audio("/order-alert.mp3");
            audio.volume = 0.5;
            audio.play().catch(e => console.warn("Audio play blocked:", e));
          } catch {
            /* noop */
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) =>
            prev.map((order) => (order.id === payload.new.id ? (payload.new as Order) : order))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) => prev.filter((order) => order.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [markFresh]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;
      const label = STATUS_CONFIG[newStatus].label;
      toast.success(`Protocol Updated: ${label}`, { duration: 3500 });
    } catch {
      toast.error("Transmission Error: Update Failed");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-32">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-electric-blue/10 border-t-electric-blue shadow-[0_0_20px_rgba(0,210,255,0.2)]" />
          <Activity className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-electric-blue" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Syncing Live Data Stream…
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] py-32 text-center"
      >
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/5 relative">
          <ShoppingBag className="h-10 w-10 text-slate-600" />
          <div className="absolute inset-0 rounded-full border border-electric-blue/20 animate-ping" />
        </div>
        <h3 className="text-2xl font-black tracking-tighter text-white uppercase">No Active Transmissions</h3>
        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 max-w-xs mx-auto">
          System is idling. Monitoring for incoming order signals via Supabase Realtime.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {orders.map((order) => {
          const nextStatus = getNextStatus(order.status);
          const config = STATUS_CONFIG[order.status];
          const StatusIcon = config.icon;
          const isFresh = freshIds.has(order.id);
          const actionCopy = nextStatus ? nextActionLabel[order.status] : null;

          return (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "group relative bg-[#0B0E14]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden transition-all duration-500 hover:border-white/20",
                isFresh && "animate-neon-pulse border-electric-blue/50"
              )}
            >
              {/* Header */}
              <div className="p-8 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                      config.color,
                      config.glow
                    )}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", config.color)}>
                          {config.label}
                        </span>
                        {isFresh && (
                          <div className="h-1.5 w-1.5 rounded-full bg-electric-blue animate-ping shadow-[0_0_8px_#00D2FF]" />
                        )}
                      </div>
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-tighter mt-0.5">
                        ID: #{order.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-white">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-sm font-black tabular-nums tracking-tighter">
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span className={cn(
                      "mt-2 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      order.order_type === "delivery"
                        ? "text-electric-blue bg-electric-blue/10 border-electric-blue/20"
                        : "text-neon-purple bg-neon-purple/10 border-neon-purple/20"
                    )}>
                      {order.order_type}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4 p-5 rounded-3xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white tracking-tight uppercase">{order.customer_name}</p>
                      <p className="text-[10px] font-bold text-slate-500 tracking-widest">{order.customer_phone}</p>
                    </div>
                  </div>
                  {order.customer_address && (
                    <div className="flex items-start gap-3 px-1">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <p className="text-[11px] font-medium leading-relaxed text-slate-400 line-clamp-2 italic">
                        {order.customer_address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Section */}
              <div className="px-8 flex-1">
                <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Inventory Items</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Quantity</span>
                  </div>
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between group/item">
                        <span className="text-xs font-bold text-slate-300 group-hover/item:text-white transition-colors">
                          {item.name}
                        </span>
                        <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-electric-blue tabular-nums">
                          {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="p-8 pt-6 space-y-6 mt-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Gross Total</span>
                  <span className="text-2xl font-black text-white tracking-tighter">
                    £{order.total_amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {nextStatus && actionCopy ? (
                  <Button
                    onClick={() => updateOrderStatus(order.id, nextStatus)}
                    disabled={updating === order.id}
                    className="w-full h-16 rounded-[1.5rem] bg-electric-blue hover:bg-electric-blue/90 text-white font-black uppercase tracking-[0.1em] text-xs shadow-[0_10px_30px_rgba(0,210,255,0.3)] hover:shadow-[0_15px_40px_rgba(0,210,255,0.5)] transition-all duration-300 active:scale-95 group/btn"
                  >
                    {updating === order.id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-3">
                        {actionCopy}
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </div>
                    )}
                  </Button>
                ) : (
                  <div className="h-16 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                      Cycle Completed
                    </span>
                  </div>
                )}
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-electric-blue/5 blur-[40px] pointer-events-none" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default LiveOrdersFeed;
