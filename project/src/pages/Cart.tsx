import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import CheckoutModal from '../components/CheckoutModal';

const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag className="h-24 w-24 text-neutral-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Your cart is empty</h1>
          <p className="text-neutral-600 mb-8">Add some amazing sports equipment to get started!</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = state.total;
  const shipping = subtotal >= 8000 ? 0 : 200; // Free shipping over ₹8,000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold heading-premium mb-4">Shopping Cart</h1>
          <p className="text-premium">{state.itemCount} items in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.size}-${item.color}`}
                className="card-premium p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-600">{item.brand}</p>
                    {item.size && (
                      <p className="text-sm text-neutral-600">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-neutral-600">Color: {item.color}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    
                    <motion.button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-neutral-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>

                  <motion.button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}

            <motion.div 
              className="flex justify-between items-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Link>

              <button
                onClick={clearCart}
                className="text-error-600 hover:text-error-800 transition-colors"
              >
                Clear Cart
              </button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div 
            className="card-premium p-6 h-fit sticky top-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold heading-premium mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal ({state.itemCount} items)</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-success-600 font-semibold">Free</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-600">GST (18%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full btn-primary flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="h-5 w-5" />
              <span>Proceed to Checkout</span>
            </motion.button>

            {subtotal < 8000 && (
              <motion.div 
                className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-warning-800 text-center">
                  Add <span className="font-bold">{formatCurrency(8000 - subtotal)}</span> more for free shipping! 🚚
                </p>
              </motion.div>
            )}

            {/* Security Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
};

export default Cart;