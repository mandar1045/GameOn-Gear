import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types/Product';
import { formatCurrency, calculateDiscountPercentage } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}) => {
  const discountPercentage = product.originalPrice 
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  if (viewMode === 'list') {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        whileHover={{ y: -2 }}
      >
        <div className="flex">
          <div className="w-48 h-48 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  {product.brand}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              <Link to={`/product/${product.id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <p className="text-gray-600 mb-4">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={onToggleWishlist}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </motion.button>

                <Link to={`/product/${product.id}`}>
                  <motion.button
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye className="h-5 w-5" />
                  </motion.button>
                </Link>

                <motion.button
                  onClick={onAddToCart}
                  disabled={!product.inStock}
                  className={`p-2 rounded-full transition-colors ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={product.inStock ? { scale: 1.1 } : {}}
                  whileTap={product.inStock ? { scale: 0.9 } : {}}
                >
                  <ShoppingCart className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-3">
            <Link to={`/product/${product.id}`}>
              <motion.button
                className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="h-5 w-5" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.originalPrice && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {discountPercentage}% OFF
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          onClick={onToggleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors ${
            isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            {product.brand}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-sm text-green-600 font-semibold">
                Save {formatCurrency(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          <motion.button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className={`p-3 rounded-full transition-all duration-300 ${
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={product.inStock ? { scale: 1.1 } : {}}
            whileTap={product.inStock ? { scale: 0.9 } : {}}
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;