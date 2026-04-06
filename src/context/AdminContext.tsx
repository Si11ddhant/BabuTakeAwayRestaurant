import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  total: number;
  type: 'delivery' | 'takeaway';
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'dispatched';
  createdAt: Date;
  isNew: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  lastOrdered: Date;
}

export interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
  growth: number;
}

interface AdminContextType {
  orders: Order[];
  customers: Customer[];
  revenueData: RevenueData[];
  loading: boolean;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'isNew'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getTotalRevenue: (period: string) => number;
  getOrderVolume: (period: string) => number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { period: 'This Week', revenue: 0, orders: 0, growth: 0 },
    { period: 'This Month', revenue: 0, orders: 0, growth: 0 },
    { period: 'Financial Year', revenue: 0, orders: 0, growth: 0 },
  ]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log('🔍 AdminContext: Fetching real-time orders from Supabase...');
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedOrders: Order[] = data.map(o => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            customerAddress: o.customer_address,
            items: o.items || [],
            total: o.total_amount,
            type: o.order_type as 'delivery' | 'takeaway',
            status: o.status as Order['status'],
            createdAt: new Date(o.created_at),
            isNew: o.status === 'new',
          }));
          setOrders(formattedOrders);
          
          const totalRev = formattedOrders.reduce((acc, o) => acc + o.total, 0);
          setRevenueData([
            { period: 'This Week', revenue: totalRev, orders: formattedOrders.length, growth: 0 },
            { period: 'This Month', revenue: totalRev, orders: formattedOrders.length, growth: 0 },
            { period: 'Financial Year', revenue: totalRev, orders: formattedOrders.length, growth: 0 },
          ]);
        } else {
          // Fallback empty array -> trigger mock
          throw new Error('Empty or no data');
        }
      } catch (err) {
        console.error('❌ AdminContext: Error fetching orders or no data available. Loading Mock Data...', err);
        // Task 1: Fallback Mock Data
        const mockOrders: Order[] = [
          {
            id: 'mock-1',
            customerName: 'Siddhant Mock',
            customerPhone: '9321200000',
            customerAddress: '123 Fake St, London',
            items: [{ id: 'menu-1', name: 'Butter Chicken', quantity: 2, price: 15.99 }],
            total: 31.98,
            type: 'delivery',
            status: 'new',
            createdAt: new Date(),
            isNew: true,
          }
        ];
        setOrders(mockOrders);
        const totalRev = mockOrders.reduce((acc, o) => acc + o.total, 0);
        setRevenueData([
            { period: 'This Week', revenue: totalRev, orders: mockOrders.length, growth: 0 },
            { period: 'This Month', revenue: totalRev, orders: mockOrders.length, growth: 0 },
            { period: 'Financial Year', revenue: totalRev, orders: mockOrders.length, growth: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Task 2: Robust Realtime Sync
    const channel = supabase
      .channel('admin-orders-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
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
            isNew: newRow.status === 'new',
          };
          setOrders(prev => [newOrder, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, status: payload.new.status, isNew: payload.new.status === 'new' } : o));
        } else if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addOrder = (newOrder: Omit<Order, 'id' | 'createdAt' | 'isNew'>) => {
    // In real app, this would be an API call to Supabase
    const order: Order = {
      ...newOrder,
      id: Date.now().toString(),
      createdAt: new Date(),
      isNew: true,
    };
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) throw error;
    } catch (err) {
      console.error('❌ AdminContext: Update status failed:', err);
    }
  };

  const getTotalRevenue = (period: string) => {
    const data = revenueData.find(d => d.period === period);
    return data ? data.revenue : 0;
  };

  const getOrderVolume = (period: string) => {
    const data = revenueData.find(d => d.period === period);
    return data ? data.orders : 0;
  };

  return (
    <AdminContext.Provider value={{
      orders,
      customers,
      revenueData,
      loading,
      addOrder,
      updateOrderStatus,
      getTotalRevenue,
      getOrderVolume,
    }}>
      {children}
    </AdminContext.Provider>
  );
};