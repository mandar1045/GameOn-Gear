// Currency formatting utilities for Indian Rupees

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCurrencyWithDecimals = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatIndianNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

// Convert amount to words (for Indian numbering system)
export const numberToWords = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `${(amount / 10000000).toFixed(1)} Crore`;
  } else if (amount >= 100000) { // 1 lakh
    return `${(amount / 100000).toFixed(1)} Lakh`;
  } else if (amount >= 1000) { // 1 thousand
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Format price range
export const formatPriceRange = (min: number, max: number): string => {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

// Check if price is in budget range
export const isInBudget = (price: number, budget: number): boolean => {
  return price <= budget;
};

// Get price category
export const getPriceCategory = (price: number): string => {
  if (price < 1000) return 'Budget';
  if (price < 5000) return 'Mid-Range';
  if (price < 20000) return 'Premium';
  return 'Luxury';
};

// Calculate EMI (simple calculation)
export const calculateEMI = (amount: number, months: number, interestRate: number = 12): number => {
  const monthlyRate = interestRate / 100 / 12;
  const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
};

// Format EMI display
export const formatEMI = (amount: number, months: number): string => {
  const emi = calculateEMI(amount, months);
  return `${formatCurrency(emi)}/month for ${months} months`;
};

// Tax calculations for India
export const calculateGST = (amount: number, gstRate: number = 18): number => {
  return Math.round((amount * gstRate) / 100);
};

// Shipping calculations
export const calculateShipping = (amount: number, freeShippingThreshold: number = 8000): number => {
  return amount >= freeShippingThreshold ? 0 : 200;
};

// Format savings display
export const formatSavings = (originalPrice: number, currentPrice: number): string => {
  const savings = originalPrice - currentPrice;
  const percentage = calculateDiscountPercentage(originalPrice, currentPrice);
  return `Save ${formatCurrency(savings)} (${percentage}% OFF)`;
};