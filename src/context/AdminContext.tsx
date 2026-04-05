import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  items: OrderItem[];
  total: number;
  type: 'Delivery' | 'Takeaway';
  status: 'New' | 'Accepted' | 'Preparing' | 'Dispatched' | 'Ready for Pickup';
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
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1001',
      customerName: 'Rahul Sharma',
      customerPhone: '098-765-4321',
      items: [
        { id: '1', name: 'Butter Chicken Rolls', quantity: 2, price: 15.99 },
        { id: '2', name: 'Paneer Handi', quantity: 1, price: 12.99 },
      ],
      total: 44.97,
      type: 'Delivery',
      status: 'New',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      isNew: true,
    },
    {
      id: '1002',
      customerName: 'Priya Kumari',
      customerPhone: '987-654-3210',
      items: [
        { id: '3', name: 'Veg Manchurian', quantity: 1, price: 11.99 },
        { id: '4', name: 'Garlic Naan', quantity: 2, price: 3.99 },
      ],
      total: 19.97,
      type: 'Takeaway',
      status: 'Accepted',
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      isNew: false,
    },
    {
      id: '1003',
      customerName: 'Amit Singh',
      customerPhone: '123-456-7890',
      items: [
        { id: '5', name: 'Paneer Tikka Rolls', quantity: 1, price: 13.99 },
      ],
      total: 13.99,
      type: 'Delivery',
      status: 'Preparing',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      isNew: false,
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '123-456-7890',
      totalOrders: 5,
      lastOrdered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '987-654-3210',
      totalOrders: 3,
      lastOrdered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { period: 'This Week', revenue: 1250.50, orders: 45, growth: 12 },
    { period: 'This Month', revenue: 5200.75, orders: 180, growth: 8 },
    { period: 'Financial Year', revenue: 65000.00, orders: 2200, growth: 15 },
  ]);

  const addOrder = (newOrder: Omit<Order, 'id' | 'createdAt' | 'isNew'>) => {
    const order: Order = {
      ...newOrder,
      id: Date.now().toString(),
      createdAt: new Date(),
      isNew: true,
    };
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status, isNew: status === 'New' ? true : false }
        : order
    ));
  };

  const getTotalRevenue = (period: string) => {
    const data = revenueData.find(d => d.period === period);
    return data ? data.revenue : 0;
  };

  const getOrderVolume = (period: string) => {
    const data = revenueData.find(d => d.period === period);
    return data ? data.orders : 0;
  };

  // Simulate new orders every 10 seconds for demo
  useEffect(() => {
    const menuItems = [
      { name: 'Butter Chicken Rolls', price: 15.99 },
      { name: 'Paneer Handi', price: 12.99 },
      { name: 'Veg Manchurian', price: 11.99 },
      { name: 'Paneer Tikka Rolls', price: 13.99 },
      { name: 'Garlic Naan', price: 3.99 },
      { name: 'Chicken Biryani', price: 14.99 },
      { name: 'Veg Biryani', price: 10.99 },
      { name: 'Tandoori Chicken', price: 16.99 },
      { name: 'Chilli Garlic Naan', price: 4.99 },
    ];

    const customerNames = [
      'Rahul Sharma', 'Priya Kumari', 'Amit Singh', 'Divya Patel', 
      'Arjun Verma', 'Sneha Gupta', 'Vikram Nair', 'Anjali Singh',
      'Rohan Das', 'Neha Reddy', 'Karan Malhotra', 'Pooja Mishra'
    ];

    const interval = setInterval(() => {
      const selectedItems = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => {
          const item = menuItems[Math.floor(Math.random() * menuItems.length)];
          return {
            id: Math.random().toString(),
            name: item.name,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: item.price,
          };
        }
      );

      const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const mockOrder: Omit<Order, 'id' | 'createdAt' | 'isNew'> = {
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        customerPhone: `${9}${Math.floor(Math.random() * 900) + 10}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        items: selectedItems,
        total: Math.round(total * 100) / 100,
        type: Math.random() > 0.5 ? 'Delivery' : 'Takeaway',
        status: 'New',
      };
      addOrder(mockOrder);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AdminContext.Provider value={{
      orders,
      customers,
      revenueData,
      addOrder,
      updateOrderStatus,
      getTotalRevenue,
      getOrderVolume,
    }}>
      {children}
    </AdminContext.Provider>
  );
};