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
  // Start with empty orders array - no sample data for new users
  const [orders, setOrders] = useState<Order[]>([]);

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