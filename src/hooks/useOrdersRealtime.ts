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
      const transformedOrders: Order[] = (data || []).map((o: any) => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerAddress: o.customer_address,
        items: o.items || [],
        total: o.total_amount,
        type: o.order_type as 'delivery' | 'takeaway',
        status: o.status as Order['status'],
        createdAt: new Date(o.created_at),
        isNew: o.status === 'new' || o.status === 'New',
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
            const newRow = payload.new as any;
            const newOrder: Order = {
              id: newRow.id,
              customerName: newRow.customer_name,
              customerPhone: newRow.customer_phone,
              customerAddress: newRow.customer_address,
              items: newRow.items || [],
              total: newRow.total_amount,
              type: newRow.order_type as 'delivery' | 'takeaway',
              status: newRow.status as Order['status'],
              createdAt: new Date(newRow.created_at),
              isNew: newRow.status === 'new' || newRow.status === 'New',
            };

            setOrders((prev) => [newOrder, ...prev]);

            // Trigger notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New Order', {
                body: `Order from ${newOrder.customerName}`,
                tag: 'new-order',
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedRow = payload.new as any;
            const updatedOrder: Order = {
              id: updatedRow.id,
              customerName: updatedRow.customer_name,
              customerPhone: updatedRow.customer_phone,
              customerAddress: updatedRow.customer_address,
              items: updatedRow.items || [],
              total: updatedRow.total_amount,
              type: updatedRow.order_type as 'delivery' | 'takeaway',
              status: updatedRow.status as Order['status'],
              createdAt: new Date(updatedRow.created_at),
              isNew: updatedRow.status === 'new' || updatedRow.status === 'New',
            };

            setOrders((prev) =>
              prev.map((o) => (o.id === updatedRow.id ? updatedOrder : o))
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
