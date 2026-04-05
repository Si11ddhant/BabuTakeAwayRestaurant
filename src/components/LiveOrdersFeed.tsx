import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Phone, User, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-blue-50 border-blue-200 text-blue-900',
  accepted: 'bg-purple-50 border-purple-200 text-purple-900',
  preparing: 'bg-orange-50 border-orange-200 text-orange-900',
  ready: 'bg-green-50 border-green-200 text-green-900',
  dispatched: 'bg-gray-50 border-gray-200 text-gray-900',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New Order',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  dispatched: 'Dispatched',
};

const LiveOrdersFeed: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('📡 Real-time update:', payload);
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev]);
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
      channel.unsubscribe();
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
      console.log('✅ Order status updated:', newStatus);
    } catch (err) {
      console.error('❌ Error updating order:', err);
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600 font-medium">No orders yet</p>
        <p className="text-gray-500 text-sm mt-1">Orders will appear here when customers place them</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => {
        const nextStatus = getNextStatus(order.status);
        const statusColor = STATUS_COLORS[order.status];

        return (
          <div
            key={order.id}
            className={cn(
              'border rounded-lg p-4 transition-all hover:shadow-lg',
              statusColor,
              order.status === 'new' && 'border-2 animate-pulse'
            )}
          >
            {/* Header with Status */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold w-fit',
                  order.status === 'new' && 'bg-blue-200 text-blue-800',
                  order.status === 'accepted' && 'bg-purple-200 text-purple-800',
                  order.status === 'preparing' && 'bg-orange-200 text-orange-800',
                  order.status === 'ready' && 'bg-green-200 text-green-800',
                  order.status === 'dispatched' && 'bg-gray-200 text-gray-800',
                )}>
                  {STATUS_LABELS[order.status]}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Order #{order.id.slice(0, 8)}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-current border-opacity-20">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <User className="h-4 w-4" />
                {order.customer_name}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                {order.customer_phone}
              </div>
              {order.customer_address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{order.customer_address}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {new Date(order.created_at).toLocaleTimeString()}
              </div>
            </div>

            {/* Order Type & Amount */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-current border-opacity-20">
              <span className="text-xs font-semibold uppercase px-2 py-1 bg-white bg-opacity-50 rounded">
                {order.order_type}
              </span>
              <span className="font-bold text-lg">£{order.total_amount.toFixed(2)}</span>
            </div>

            {/* Items */}
            <div className="mb-4 pb-4 border-b border-current border-opacity-20">
              <p className="text-xs font-bold uppercase opacity-75 mb-2">Items</p>
              <ul className="space-y-1 text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-xs">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            {nextStatus && (
              <Button
                onClick={() => updateOrderStatus(order.id, nextStatus)}
                disabled={updating === order.id}
                className="w-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 border border-current border-opacity-20"
              >
                {updating === order.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <span>Mark as {STATUS_LABELS[nextStatus]}</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            )}
            {!nextStatus && (
              <div className="text-center text-xs font-semibold opacity-75 py-2">
                ✓ Order Complete
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LiveOrdersFeed;
