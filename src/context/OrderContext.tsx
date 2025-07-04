import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderItem, ShippingAddress } from '../types/Order';

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }) => Order;
  getOrder: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([
    // Sample orders for demonstration with Indian prices
    {
      id: 'order-1',
      orderNumber: 'GS-2024-001',
      date: '2024-01-15T10:30:00Z',
      status: 'delivered',
      items: [
        {
          id: 'football-1',
          name: 'Nike Vapor Elite Football Cleats',
          price: 12500,
          quantity: 1,
          size: '10',
          color: 'Black',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
          brand: 'Nike'
        },
        {
          id: 'football-2',
          name: 'Wilson Official NFL Football',
          price: 2500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=400&q=80',
          brand: 'Wilson'
        }
      ],
      subtotal: 15000,
      shipping: 0,
      tax: 2700,
      total: 17700,
      shippingAddress: {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+91 98765 43210',
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      paymentMethod: 'UPI Payment',
      trackingNumber: 'GS1234567890',
      deliveredDate: '2024-01-18T14:30:00Z'
    },
    {
      id: 'order-2',
      orderNumber: 'GS-2024-002',
      date: '2024-01-20T15:45:00Z',
      status: 'shipped',
      items: [
        {
          id: 'basketball-1',
          name: 'Jordan Air Max Basketball Shoes',
          price: 8500,
          quantity: 1,
          size: '9',
          color: 'Black/Red',
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80',
          brand: 'Jordan'
        }
      ],
      subtotal: 8500,
      shipping: 200,
      tax: 1530,
      total: 10230,
      shippingAddress: {
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 87654 32109',
        street: '456 Park Street',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        country: 'India'
      },
      paymentMethod: 'Credit Card',
      trackingNumber: 'GS0987654321',
      estimatedDelivery: '2024-01-25T12:00:00Z'
    },
    {
      id: 'order-3',
      orderNumber: 'GS-2024-003',
      date: '2024-01-22T09:15:00Z',
      status: 'processing',
      items: [
        {
          id: 'tennis-1',
          name: 'Wilson Pro Staff Tennis Racket',
          price: 15000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400&q=80',
          brand: 'Wilson'
        }
      ],
      subtotal: 15000,
      shipping: 0,
      tax: 2700,
      total: 17700,
      shippingAddress: {
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@example.com',
        phone: '+91 76543 21098',
        street: '789 Brigade Road',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India'
      },
      paymentMethod: 'UPI Payment',
      estimatedDelivery: '2024-01-28T12:00:00Z'
    }
  ]);

  const generateOrderNumber = (): string => {
    const year = new Date().getFullYear();
    const orderCount = orders.length + 1;
    return `GS-${year}-${orderCount.toString().padStart(3, '0')}`;
  };

  const addOrder = (orderData: {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
  }): Order => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      date: new Date().toISOString(),
      status: 'confirmed',
      ...orderData,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status,
            ...(status === 'delivered' && { deliveredDate: new Date().toISOString() })
          }
        : order
    ));
  };

  const getOrdersByStatus = (status: Order['status']): Order[] => {
    return orders.filter(order => order.status === status);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      getOrder,
      updateOrderStatus,
      getOrdersByStatus,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};