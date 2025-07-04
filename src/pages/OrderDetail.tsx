import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatCurrency } from '../utils/currency';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(id || '');

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Order not found</h1>
          <p className="text-neutral-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/profile" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-success-600" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-primary-600" />;
      case 'processing':
        return <Clock className="h-6 w-6 text-warning-600" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-error-600" />;
      default:
        return <Clock className="h-6 w-6 text-neutral-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'shipped':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'processing':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'cancelled':
        return 'bg-error-100 text-error-800 border-error-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderSteps = [
    { status: 'confirmed', label: 'Order Confirmed', completed: true },
    { status: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status) },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/profile"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold heading-premium mb-2">Order {order.orderNumber}</h1>
              <p className="text-neutral-600">Placed on {formatDate(order.date)}</p>
            </div>
            
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="font-semibold capitalize">{order.status}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <motion.div 
              className="card-premium p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold heading-premium mb-6">Order Progress</h2>
              
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-neutral-200"></div>
                
                <div className="space-y-6">
                  {orderSteps.map((step, index) => (
                    <motion.div
                      key={step.status}
                      className="relative flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          step.completed ? 'text-neutral-900' : 'text-neutral-500'
                        }`}>
                          {step.label}
                        </h3>
                        {step.status === order.status && (
                          <p className="text-sm text-primary-600 font-medium">Current Status</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Truck className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold text-primary-900">Tracking Information</span>
                  </div>
                  <p className="text-primary-800">
                    Tracking Number: <span className="font-mono font-bold">{order.trackingNumber}</span>
                  </p>
                  {order.estimatedDelivery && order.status !== 'delivered' && (
                    <p className="text-primary-700 text-sm mt-1">
                      Estimated Delivery: {formatDate(order.estimatedDelivery)}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Order Items */}
            <motion.div 
              className="card-premium p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold heading-premium mb-6">Order Items ({order.items.length})</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                      <p className="text-sm text-neutral-600">{item.brand}</p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-sm text-neutral-600">{formatCurrency(item.price)} each</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <motion.div 
              className="card-premium p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold heading-premium mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? (
                      <span className="text-success-600 font-semibold">Free</span>
                    ) : (
                      formatCurrency(order.shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600">GST (18%)</span>
                  <span className="font-medium">{formatCurrency(order.tax)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div 
              className="card-premium p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-bold heading-premium mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                Shipping Address
              </h3>
              
              <div className="text-sm text-neutral-600 space-y-1">
                <p className="font-medium text-neutral-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                
                <div className="pt-3 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    <span>{order.shippingAddress.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-neutral-400" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              className="card-premium p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-bold heading-premium mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                Payment Method
              </h3>
              
              <p className="text-neutral-900 font-medium">{order.paymentMethod}</p>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {order.status === 'delivered' && (
                <button className="w-full btn-primary">
                  Reorder Items
                </button>
              )}
              
              <button className="w-full btn-outline">
                Download Invoice
              </button>
              
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <button className="w-full text-error-600 hover:text-error-800 transition-colors text-sm">
                  Cancel Order
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;