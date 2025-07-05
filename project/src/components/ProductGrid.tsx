import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Filter } from 'lucide-react';
import { Product } from '../types/Product';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const products: Product[] = [
    {
      id: '1',
      name: 'Nike Mercurial Vapor XV',
      price: 249.99,
      originalPrice: 299.99,
      category: 'boots',
      image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Speed and precision on the pitch with lightweight design and superior traction.',
      features: ['Lightweight construction', 'Superior grip', 'Comfortable fit', 'Durable materials'],
      inStock: true,
      rating: 4.8,
      reviews: 324,
      brand: 'Nike'
    },
    {
      id: '2',
      name: 'Adidas Predator Elite',
      price: 279.99,
      category: 'boots',
      image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Engineered for control and power with revolutionary grip technology.',
      features: ['Control zones', 'Power strikes', 'Adaptive fit', 'Premium leather'],
      inStock: true,
      rating: 4.9,
      reviews: 267,
      brand: 'Adidas'
    },
    {
      id: '3',
      name: 'FIFA Pro Match Ball',
      price: 159.99,
      category: 'balls',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Official FIFA approved match ball for professional play.',
      features: ['FIFA approved', 'Perfect sphericity', 'Water resistant', 'Premium feel'],
      inStock: true,
      rating: 4.7,
      reviews: 189,
      brand: 'FIFA'
    },
    {
      id: '4',
      name: 'Training Cone Set',
      price: 29.99,
      category: 'training',
      image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Professional training cones for agility and skill development.',
      features: ['Durable plastic', 'Bright colors', 'Stackable design', '12-piece set'],
      inStock: true,
      rating: 4.5,
      reviews: 94,
      brand: 'Pro Training'
    },
    {
      id: '5',
      name: 'Team Jersey Home',
      price: 89.99,
      category: 'apparel',
      image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Official team jersey with moisture-wicking technology.',
      features: ['Moisture-wicking', 'Comfortable fit', 'Official design', 'Machine washable'],
      inStock: true,
      rating: 4.6,
      reviews: 156,
      brand: 'TeamGear'
    },
    {
      id: '6',
      name: 'Goalkeeper Gloves Pro',
      price: 79.99,
      originalPrice: 99.99,
      category: 'accessories',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Professional goalkeeper gloves with superior grip and protection.',
      features: ['Enhanced grip', 'Impact protection', 'Breathable design', 'Adjustable wrist'],
      inStock: true,
      rating: 4.8,
      reviews: 112,
      brand: 'GKPro'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'boots', name: 'Football Boots' },
    { id: 'balls', name: 'Footballs' },
    { id: 'training', name: 'Training' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Premium Equipment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our curated collection of professional-grade football equipment, 
            trusted by athletes worldwide.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  onClick={() => onProductClick(product)}
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-3">
                    <button
                      onClick={() => onProductClick(product)}
                      className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      <Filter className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.originalPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Sale
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      favorites.has(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>
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

                <h3 
                  className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onProductClick(product)}
                >
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price and Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={!product.inStock}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      product.inStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-4 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;