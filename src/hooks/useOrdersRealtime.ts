import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/context/AdminContext';

export const useOrdersRealtime = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform database records to Order interface
      const transformedOrders = (data || []).map((order: any) => ({
        ...order,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
        isNew: order.status === 'New',
      }));

      setOrders(transformedOrders);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // New order placed by customer
            const newOrder = {
              ...payload.new,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at),
              isNew: true,
            };

            setOrders((prev) => [newOrder, ...prev]);

            // Trigger notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New Order', {
                body: `Order from ${newOrder.customer_name}`,
                tag: 'new-order',
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            // Admin updated order status
            const updatedOrder = {
              ...payload.new,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at),
              isNew: payload.new.status === 'New',
            };

            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? updatedOrder : o))
            );
          } else if (payload.eventType === 'DELETE') {
            // Order cancelled
            setOrders((prev) =>
              prev.filter((o) => o.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to orders realtime');
        }
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: Order['status']) => {
      try {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Error updating order status:', err);
        throw err;
      }
    },
    []
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
  };
};
