import { UPIPaymentMethod, PaymentRequest, PaymentResponse, UPIQRData } from '../types/Payment';

// UPI Payment Methods Configuration with your beneficiary account
export const upiPaymentMethods: UPIPaymentMethod[] = [
  {
    id: 'googlepay',
    name: 'Google Pay',
    icon: '🔵',
    description: 'Pay using Google Pay UPI',
    type: 'upi',
    upiId: '7020212202@ybl',
    deepLink: 'tez://upi/pay'
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    icon: '💜',
    description: 'Pay using PhonePe UPI',
    type: 'upi',
    upiId: '7020212202@ybl',
    deepLink: 'phonepe://pay'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    icon: '🔷',
    description: 'Pay using Paytm UPI',
    type: 'upi',
    upiId: '7020212202@ybl',
    deepLink: 'paytmmp://pay'
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    icon: '🇮🇳',
    description: 'Pay using BHIM or any UPI app',
    type: 'upi',
    upiId: '7020212202@ybl',
    deepLink: 'upi://pay'
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    icon: '🟠',
    description: 'Pay using Amazon Pay UPI',
    type: 'upi',
    upiId: '7020212202@ybl',
    deepLink: 'amazonpay://pay'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Pay',
    icon: '💚',
    description: 'Pay using WhatsApp Pay',
    type: 'upi',
    upiId: '7020212202@ybl',
    deepLink: 'whatsapp://pay'
  }
];

// Generate UPI Payment URL
export const generateUPIPaymentURL = (
  method: UPIPaymentMethod,
  amount: number,
  orderId: string,
  customerName: string
): string => {
  const params = new URLSearchParams({
    pa: '7020212202@ybl', // Your UPI ID as Payee Address
    pn: 'GearUp Sports', // Payee Name
    am: amount.toString(), // Amount
    cu: 'INR', // Currency
    tn: `GearUp Sports Order ${orderId}`, // Transaction Note
    tr: orderId, // Transaction Reference
    mc: '5411', // Merchant Category Code (Sporting Goods)
    mode: '02', // Transaction Mode
    purpose: '00' // Purpose Code
  });

  return `${method.deepLink}?${params.toString()}`;
};

// Generate UPI QR Code Data
export const generateUPIQRData = (
  amount: number,
  orderId: string,
  customerName: string
): UPIQRData => {
  return {
    payeeVPA: '7020212202@ybl', // Your UPI ID
    payeeName: 'GearUp Sports',
    amount,
    transactionNote: `GearUp Sports Order ${orderId}`,
    transactionRef: orderId
  };
};

// Generate UPI QR Code String
export const generateUPIQRString = (qrData: UPIQRData): string => {
  return `upi://pay?pa=${qrData.payeeVPA}&pn=${encodeURIComponent(qrData.payeeName)}&am=${qrData.amount}&cu=INR&tn=${encodeURIComponent(qrData.transactionNote)}&tr=${qrData.transactionRef}`;
};

// Simulate UPI Payment Processing
export const processUPIPayment = async (
  paymentRequest: PaymentRequest,
  method: UPIPaymentMethod
): Promise<PaymentResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  // Simulate payment success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    return {
      success: true,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      paymentId: `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`,
      orderId: paymentRequest.orderId,
      amount: paymentRequest.amount,
      status: 'success',
      method: method.name,
      timestamp: new Date().toISOString()
    };
  } else {
    return {
      success: false,
      orderId: paymentRequest.orderId,
      amount: paymentRequest.amount,
      status: 'failed',
      method: method.name,
      error: 'Payment failed. Please try again.',
      timestamp: new Date().toISOString()
    };
  }
};

// Validate UPI ID
export const validateUPIId = (upiId: string): boolean => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return upiRegex.test(upiId);
};

// Format Indian Currency
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Convert USD to INR (mock exchange rate)
export const convertUSDToINR = (usdAmount: number): number => {
  const exchangeRate = 83.25; // Mock exchange rate
  return Math.round(usdAmount * exchangeRate * 100) / 100;
};

// Check if device supports UPI
export const isUPISupported = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  return isMobile;
};

// Open UPI App
export const openUPIApp = (paymentURL: string): void => {
  if (isUPISupported()) {
    window.location.href = paymentURL;
  } else {
    // Fallback for desktop - show QR code
    console.log('UPI not supported on this device. Show QR code instead.');
  }
};