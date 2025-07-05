import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, QrCode, Copy, Check, AlertCircle, Loader, CreditCard, Wallet } from 'lucide-react';
import { upiPaymentMethods, generateUPIPaymentURL, generateUPIQRString, generateUPIQRData, processUPIPayment, formatIndianCurrency, convertUSDToINR, isUPISupported, openUPIApp, validateUPIId } from '../utils/upiPayments';
import { PaymentRequest, PaymentResponse, UPIPaymentMethod } from '../types/Payment';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // Amount in USD
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess: (response: PaymentResponse) => void;
  onPaymentFailure: (error: string) => void;
}

const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderId,
  customerInfo,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [selectedMethod, setSelectedMethod] = useState<UPIPaymentMethod | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'qr' | 'processing' | 'success' | 'failed'>('select');
  const [customUPIId, setCustomUPIId] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  const amountINR = (amount*100/100);
  const isMobileDevice = isUPISupported();

  // Timer for payment timeout
  useEffect(() => {
    if (paymentStep === 'qr' || paymentStep === 'processing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStep('failed');
            onPaymentFailure('Payment timeout. Please try again.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStep, onPaymentFailure]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
      setPaymentStep('select');
      setCustomUPIId('');
      setQrCodeData('');
      setCopied(false);
      setPaymentResponse(null);
      setTimeLeft(300);
    }
  }, [isOpen]);

  const handleMethodSelect = (method: UPIPaymentMethod) => {
    setSelectedMethod(method);
    
    if (isMobileDevice && method.deepLink) {
      // Generate payment URL and redirect to UPI app
      const paymentURL = generateUPIPaymentURL(method, amountINR, orderId, customerInfo.name);
      openUPIApp(paymentURL);
      setPaymentStep('processing');
      
      // Simulate payment processing
      setTimeout(() => {
        processPayment(method);
      }, 3000);
    } else {
      // Show QR code for desktop or unsupported devices
      const qrData = generateUPIQRData(amountINR, orderId, customerInfo.name);
      const qrString = generateUPIQRString(qrData);
      setQrCodeData(qrString);
      setPaymentStep('qr');
    }
  };

  const handleCustomUPIPay = () => {
    if (!validateUPIId(customUPIId)) {
      alert('Please enter a valid UPI ID');
      return;
    }

    const customMethod: UPIPaymentMethod = {
      id: 'custom',
      name: 'Custom UPI',
      icon: '💳',
      description: 'Pay using your UPI ID',
      type: 'upi',
      upiId: customUPIId
    };

    handleMethodSelect(customMethod);
  };

  const processPayment = async (method: UPIPaymentMethod) => {
    setPaymentStep('processing');

    const paymentRequest: PaymentRequest = {
      amount: amountINR,
      currency: 'INR',
      orderId,
      customerInfo,
      items: [] // This would be populated with actual cart items
    };

    try {
      const response = await processUPIPayment(paymentRequest, method);
      setPaymentResponse(response);

      if (response.success) {
        setPaymentStep('success');
        onPaymentSuccess(response);
      } else {
        setPaymentStep('failed');
        onPaymentFailure(response.error || 'Payment failed');
      }
    } catch (error) {
      setPaymentStep('failed');
      onPaymentFailure('Payment processing error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ 
        cursor: 'auto',
        filter: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none'
      }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Enhanced Backdrop */}
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60"
          style={{ 
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            filter: 'none'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div 
          className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-premium-lg rounded-2xl relative z-10"
          style={{ 
            filter: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            isolation: 'isolate'
          }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div 
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white"
            style={{ filter: 'none' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors z-10"
              style={{ cursor: 'pointer', filter: 'none' }}
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">UPI Payment</h2>
                <p className="text-white/80">Secure & Instant Payment</p>
              </div>
            </div>

            {/* Amount Display */}
            <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Amount:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatIndianCurrency(amountINR)}</div>
                  <div className="text-sm text-white/60">${amount.toFixed(2)} USD</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-white/60">
                Order ID: {orderId}
              </div>
            </div>

            {/* Timer */}
            {(paymentStep === 'qr' || paymentStep === 'processing') && (
              <div className="mt-3 text-center">
                <div className="text-sm text-white/80">
                  Time remaining: <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div 
            className="p-6"
            style={{ 
              filter: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none'
            }}
          >
            <AnimatePresence mode="wait">
              {/* Method Selection */}
              {paymentStep === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                  style={{ filter: 'none' }}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
                    
                    {/* UPI Apps */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {upiPaymentMethods.map((method) => (
                        <motion.button
                          key={method.id}
                          onClick={() => handleMethodSelect(method)}
                          className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group relative z-10"
                          style={{ 
                            cursor: 'pointer',
                            filter: 'none',
                            backdropFilter: 'none',
                            WebkitBackdropFilter: 'none'
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{method.icon}</div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                                {method.name}
                              </div>
                              <div className="text-xs text-gray-600">{method.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Custom UPI ID */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Or pay with any UPI ID</h4>
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          placeholder="Enter UPI ID (e.g., user@paytm)"
                          value={customUPIId}
                          onChange={(e) => setCustomUPIId(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ 
                            cursor: 'text',
                            filter: 'none',
                            backdropFilter: 'none',
                            WebkitBackdropFilter: 'none'
                          }}
                        />
                        <motion.button
                          onClick={handleCustomUPIPay}
                          disabled={!customUPIId}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          style={{ 
                            cursor: customUPIId ? 'pointer' : 'not-allowed',
                            filter: 'none'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Pay
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* QR Code Display */}
              {paymentStep === 'qr' && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center space-y-6"
                  style={{ filter: 'none' }}
                >
                  <div>
                    <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code to Pay</h3>
                    <p className="text-gray-600">Open any UPI app and scan this QR code</p>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="w-64 h-64 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">QR Code</p>
                      <p className="text-xs text-gray-400 mt-1">{formatIndianCurrency(amountINR)}</p>
                      <div className="mt-2 text-xs text-blue-600 font-medium">
                        Pay to: 7020212202@ybl
                      </div>
                    </div>
                  </div>

                  {/* UPI String */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-mono break-all flex-1 mr-2">
                        {qrCodeData}
                      </span>
                      <motion.button
                        onClick={() => copyToClipboard(qrCodeData)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                        style={{ cursor: 'pointer', filter: 'none' }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => processPayment(selectedMethod!)}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    style={{ cursor: 'pointer', filter: 'none' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    I have completed the payment
                  </motion.button>
                </motion.div>
              )}

              {/* Processing */}
              {paymentStep === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8"
                  style={{ filter: 'none' }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
                  <p className="text-gray-600">Please wait while we verify your payment...</p>
                  <div className="mt-4 text-sm text-gray-500">
                    Using {selectedMethod?.name}
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    Payment to: 7020212202@ybl
                  </div>
                </motion.div>
              )}

              {/* Success */}
              {paymentStep === 'success' && paymentResponse && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8"
                  style={{ filter: 'none' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                  
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Transaction ID:</span>
                        <p className="font-semibold text-green-800">{paymentResponse.transactionId}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <p className="font-semibold text-green-800">{formatIndianCurrency(paymentResponse.amount)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Method:</span>
                        <p className="font-semibold text-green-800">{paymentResponse.method}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-semibold text-green-800 capitalize">{paymentResponse.status}</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={onClose}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    style={{ cursor: 'pointer', filter: 'none' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              )}

              {/* Failed */}
              {paymentStep === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8"
                  style={{ filter: 'none' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 mb-6">
                    {paymentResponse?.error || 'Something went wrong. Please try again.'}
                  </p>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setPaymentStep('select')}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      style={{ cursor: 'pointer', filter: 'none' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Try Again
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ cursor: 'pointer', filter: 'none' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
