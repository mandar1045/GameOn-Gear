import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, Truck, Shield, Check, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { OrderItem, ShippingAddress } from '../types/Order';
import { PaymentResponse } from '../types/Payment';
import { formatCurrency } from '../utils/currency';
import UPIPaymentModal from './UPIPaymentModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking';
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { state, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [showUPIModal, setShowUPIModal] = useState(false);
  
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [selectedPayment, setSelectedPayment] = useState<string>('');

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsProcessing(false);
      setOrderComplete(false);
      setCompletedOrder(null);
      setSelectedPayment('');
      setShowUPIModal(false);
      setAddress({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      });
    }
  }, [isOpen]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: '📱',
      description: 'Pay using UPI apps like GPay, PhonePe, Paytm',
      type: 'upi'
    },
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay',
      type: 'card'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks supported',
      type: 'netbanking'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '👛',
      description: 'Paytm, Amazon Pay, MobiKwik',
      type: 'wallet'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive',
      type: 'card'
    }
  ];

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () => {
    return address.firstName && address.lastName && address.email && 
           address.phone && address.street && address.city && 
           address.state && address.zipCode;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && isAddressValid()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedPayment) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    
    if (methodId === 'upi') {
      // Open UPI payment modal immediately
      setShowUPIModal(true);
    }
  };

  const handleUPIPaymentSuccess = (response: PaymentResponse) => {
    setShowUPIModal(false);
    completeOrder('UPI Payment', response.transactionId);
  };

  const handleUPIPaymentFailure = (error: string) => {
    setShowUPIModal(false);
    setSelectedPayment('');
    alert(`Payment failed: ${error}`);
  };

  const handlePlaceOrder = async () => {
    if (selectedPayment === 'upi') {
      setShowUPIModal(true);
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing for other methods
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentMethodName = paymentMethods.find(pm => pm.id === selectedPayment)?.name || 'Unknown';
    completeOrder(paymentMethodName);
  };

  const completeOrder = (paymentMethodName: string, transactionId?: string) => {
    // Convert cart items to order items
    const orderItems: OrderItem[] = state.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.image,
      brand: item.brand
    }));

    // Create order
    const subtotal = state.total;
    const shipping = subtotal >= 8000 ? 0 : 200; // Free shipping over ₹8,000
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    const shippingAddress: ShippingAddress = {
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    };

    const newOrder = addOrder({
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentMethod: paymentMethodName
    });

    setCompletedOrder(newOrder);
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
    
    // Auto close after 5 seconds
    setTimeout(() => {
      onClose();
      setOrderComplete(false);
      setCurrentStep(1);
      setCompletedOrder(null);
    }, 5000);
  };

  const handleClose = () => {
    onClose();
    // Reset state after a short delay to allow exit animation
    setTimeout(() => {
      setCurrentStep(1);
      setIsProcessing(false);
      setOrderComplete(false);
      setCompletedOrder(null);
      setSelectedPayment('');
      setShowUPIModal(false);
      setAddress({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      });
    }, 300);
  };

  const subtotal = state.total;
  const shipping = subtotal >= 8000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex items-start justify-center min-h-screen px-4 pt-8 pb-20">
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div 
            className="relative w-full max-w-6xl bg-white shadow-premium-lg rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {orderComplete ? 'Order Confirmed!' : 'Secure Checkout'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[80vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {orderComplete ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8 text-center"
                  >
                    <motion.div 
                      className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <Check className="h-8 w-8 text-success-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank you for your order!</h3>
                    <p className="text-gray-600 mb-6">
                      Your order has been successfully placed and saved to your account. You'll receive a confirmation email shortly.
                    </p>
                    {completedOrder && (
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Order Number:</p>
                            <p className="font-bold text-primary-600">{completedOrder.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Order Total:</p>
                            <p className="font-bold">{formatCurrency(completedOrder.total)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Items:</p>
                            <p className="font-bold">{completedOrder.items.length}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status:</p>
                            <p className="font-bold text-success-600 capitalize">{completedOrder.status}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      You can track your order in the "My Orders" section of your profile.
                    </p>
                  </motion.div>
                ) : (
                  <div className="p-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Main Content */}
                      <div className="lg:col-span-2">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between mb-8">
                          {[
                            { step: 1, label: 'Shipping' },
                            { step: 2, label: 'Payment' },
                            { step: 3, label: 'Review' }
                          ].map(({ step, label }, index) => (
                            <div key={step} className="flex items-center">
                              <motion.div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                                  currentStep >= step 
                                    ? 'bg-primary-600 text-white shadow-lg' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {currentStep > step ? <Check className="h-5 w-5" /> : step}
                              </motion.div>
                              <span className={`ml-3 text-sm font-medium transition-colors ${
                                currentStep >= step ? 'text-primary-600' : 'text-gray-500'
                              }`}>
                                {label}
                              </span>
                              {index < 2 && (
                                <div className={`w-16 h-0.5 mx-4 transition-colors ${
                                  currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Step Content */}
                        <div className="min-h-[400px]">
                          <AnimatePresence mode="wait">
                            {/* Step 1: Address */}
                            {currentStep === 1 && (
                              <motion.div
                                key="address"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                              >
                                <div className="flex items-center space-x-2 mb-6">
                                  <MapPin className="h-5 w-5 text-primary-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={address.firstName}
                                      onChange={(e) => handleAddressChange('firstName', e.target.value)}
                                      className="input-premium"
                                      placeholder="John"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={address.lastName}
                                      onChange={(e) => handleAddressChange('lastName', e.target.value)}
                                      className="input-premium"
                                      placeholder="Doe"
                                      required
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    value={address.email}
                                    onChange={(e) => handleAddressChange('email', e.target.value)}
                                    className="input-premium"
                                    placeholder="john.doe@example.com"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    value={address.phone}
                                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                                    className="input-premium"
                                    placeholder="+91 98765 43210"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={address.street}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    className="input-premium"
                                    placeholder="123 Main Street"
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={address.city}
                                      onChange={(e) => handleAddressChange('city', e.target.value)}
                                      className="input-premium"
                                      placeholder="Mumbai"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      State <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={address.state}
                                      onChange={(e) => handleAddressChange('state', e.target.value)}
                                      className="input-premium"
                                      placeholder="Maharashtra"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      PIN Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={address.zipCode}
                                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                                      className="input-premium"
                                      placeholder="400001"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Country <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                      value={address.country}
                                      onChange={(e) => handleAddressChange('country', e.target.value)}
                                      className="input-premium"
                                    >
                                      <option value="India">India</option>
                                      <option value="United States">United States</option>
                                      <option value="Canada">Canada</option>
                                      <option value="United Kingdom">United Kingdom</option>
                                      <option value="Australia">Australia</option>
                                    </select>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 2 && (
                              <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                              >
                                <div className="flex items-center space-x-2 mb-6">
                                  <CreditCard className="h-5 w-5 text-primary-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                                </div>

                                <div className="space-y-3">
                                  {paymentMethods.map((method) => (
                                    <motion.div
                                      key={method.id}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                        selectedPayment === method.id
                                          ? 'border-primary-500 bg-primary-50 shadow-lg'
                                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                      }`}
                                      onClick={() => handlePaymentMethodSelect(method.id)}
                                    >
                                      <div className="flex items-center space-x-4">
                                        <div className="text-2xl">{method.icon}</div>
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-gray-900">{method.name}</h4>
                                          <p className="text-sm text-gray-600">{method.description}</p>
                                          {method.id === 'upi' && (
                                            <div className="flex items-center mt-2 space-x-2">
                                              <Smartphone className="h-4 w-4 text-blue-600" />
                                              <span className="text-xs text-blue-600 font-medium">Instant & Secure</span>
                                            </div>
                                          )}
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                                          selectedPayment === method.id
                                            ? 'border-primary-500 bg-primary-500'
                                            : 'border-gray-300'
                                        }`}>
                                          {selectedPayment === method.id && (
                                            <motion.div 
                                              className="w-full h-full rounded-full bg-white scale-50"
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 0.5 }}
                                              transition={{ type: "spring", stiffness: 300 }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                              <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                              >
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Your Order</h3>

                                {/* Shipping Address */}
                                <div className="bg-gray-50 rounded-lg p-4 border">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                                    Shipping Address
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {address.firstName} {address.lastName}<br />
                                    {address.street}<br />
                                    {address.city}, {address.state} {address.zipCode}<br />
                                    {address.country}
                                  </p>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-gray-50 rounded-lg p-4 border">
                                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2 text-primary-600" />
                                    Payment Method
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {paymentMethods.find(m => m.id === selectedPayment)?.name}
                                  </p>
                                </div>

                                {/* Order Items */}
                                <div className="bg-gray-50 rounded-lg p-4 border">
                                  <h4 className="font-semibold text-gray-900 mb-4">Order Items ({state.itemCount})</h4>
                                  <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {state.items.map((item) => (
                                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                          <p className="text-xs text-gray-600">
                                            Qty: {item.quantity} 
                                            {item.size && ` • Size: ${item.size}`}
                                            {item.color && ` • Color: ${item.color}`}
                                          </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {formatCurrency(item.price * item.quantity)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                          <motion.button
                            onClick={handlePreviousStep}
                            disabled={currentStep === 1}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                              currentStep === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                            whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
                            whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
                          >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Previous</span>
                          </motion.button>

                          {currentStep < 3 ? (
                            <motion.button
                              onClick={handleNextStep}
                              disabled={
                                (currentStep === 1 && !isAddressValid()) ||
                                (currentStep === 2 && !selectedPayment)
                              }
                              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                (currentStep === 1 && !isAddressValid()) ||
                                (currentStep === 2 && !selectedPayment)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'btn-primary'
                              }`}
                              whileHover={
                                (currentStep === 1 && isAddressValid()) ||
                                (currentStep === 2 && selectedPayment)
                                  ? { scale: 1.02 }
                                  : {}
                              }
                              whileTap={
                                (currentStep === 1 && isAddressValid()) ||
                                (currentStep === 2 && selectedPayment)
                                  ? { scale: 0.98 }
                                  : {}
                              }
                            >
                              <span>Continue</span>
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          ) : (
                            <motion.button
                              onClick={handlePlaceOrder}
                              disabled={isProcessing}
                              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all ${
                                isProcessing
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'btn-primary'
                              }`}
                              whileHover={!isProcessing ? { scale: 1.02 } : {}}
                              whileTap={!isProcessing ? { scale: 0.98 } : {}}
                            >
                              {isProcessing ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <span>Place Order</span>
                                  <Check className="h-4 w-4" />
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Order Summary Sidebar */}
                      <div className="lg:col-span-1">
                        <div className="card-premium p-6 sticky top-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                              <span className="font-medium">{formatCurrency(subtotal)}</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Shipping</span>
                              <span className="font-medium">
                                {shipping === 0 ? (
                                  <span className="text-success-600 font-semibold">Free</span>
                                ) : (
                                  formatCurrency(shipping)
                                )}
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">GST (18%)</span>
                              <span className="font-medium">{formatCurrency(tax)}</span>
                            </div>
                            
                            <div className="border-t pt-3">
                              <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary-600">{formatCurrency(total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Security Features */}
                          <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-success-600" />
                              <span>256-bit SSL encryption</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-primary-600" />
                              <span>Free shipping on orders over ₹8,000</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-success-600" />
                              <span>30-day return policy</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={showUPIModal}
        onClose={() => setShowUPIModal(false)}
        amount={total}
        orderId={`ORDER-${Date.now()}`}
        customerInfo={{
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          phone: address.phone
        }}
        onPaymentSuccess={handleUPIPaymentSuccess}
        onPaymentFailure={handleUPIPaymentFailure}
      />
    </>
  );
};

export default CheckoutModal;