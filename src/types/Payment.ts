export interface UPIPaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'upi' | 'card' | 'wallet' | 'netbanking';
  upiId?: string;
  deepLink?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  method: string;
  error?: string;
  timestamp: string;
}

export interface UPIQRData {
  payeeVPA: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  transactionRef: string;
}