import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, User, Heart, Zap, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { state: cartState } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  // Handle scroll effect with blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const navItems = [
    { name: 'Football', path: '/products/football' },
    { name: 'Basketball', path: '/products/basketball' },
    { name: 'Tennis', path: '/products/tennis' },
    { name: 'Swimming', path: '/products/swimming' },
    { name: 'Running', path: '/products/running' },
    { name: 'Fitness', path: '/products/fitness' },
  ];

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-premium border-b border-gray-200/50' 
            : 'bg-white'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          backdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'none',
        }}
      >
        {/* Top Bar */}
        <div className={`bg-black text-white text-xs transition-all duration-500 ${
          isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-8 opacity-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-8">
              <div className="flex items-center space-x-6">
                <span>Free shipping on orders over ₹8,000</span>
                <span className="hidden md:block">Trusted by 100,000+ athletes</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
                <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
                <span className="text-white/60">|</span>
                <span>📞 1-800-GEARUP-SPORTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className={`transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/30' 
            : 'bg-white border-b border-gray-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex justify-between items-center transition-all duration-500 ${
              isScrolled ? 'h-14' : 'h-16'
            }`}>
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className={`relative transition-all duration-500 ${
                  isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg"></div>
                  <div className="absolute inset-1 bg-black rounded-lg flex items-center justify-center">
                    <Zap className={`text-yellow-400 transition-all duration-500 ${
                      isScrolled ? 'h-4 w-4' : 'h-5 w-5'
                    }`} />
                  </div>
                </div>
                
                <div>
                  <h1 className={`font-bold text-gray-900 transition-all duration-500 ${
                    isScrolled ? 'text-lg' : 'text-xl'
                  }`}>
                    GearUp<span className="text-yellow-500">Sports</span>
                  </h1>
                  <div className={`font-medium tracking-wider text-gray-600 transition-all duration-500 ${
                    isScrolled ? 'text-xs opacity-0 h-0' : 'text-xs opacity-100 h-auto'
                  }`}>
                    PREMIUM GEAR
                  </div>
                </div>
              </Link>

              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-yellow-600 border-b-2 border-yellow-600 pb-1'
                        : 'text-gray-700 hover:text-yellow-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="hidden md:flex relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-sm ${
                        isScrolled 
                          ? 'w-48 bg-white/90 backdrop-blur-sm' 
                          : 'w-64 bg-white'
                      }`}
                      style={{
                        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
                        WebkitBackdropFilter: isScrolled ? 'blur(8px)' : 'none',
                      }}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </form>

                {/* Authentication */}
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-yellow-600 transition-colors text-sm font-medium"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className={isScrolled ? 'hidden xl:block' : 'block'}>Sign In</span>
                    </button>

                    <button
                      onClick={() => openAuthModal('register')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className={isScrolled ? 'hidden xl:block' : 'block'}>Sign Up</span>
                    </button>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Wishlist */}
                  <Link 
                    to="/wishlist" 
                    className="relative p-2 text-gray-600 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100/50"
                  >
                    <Heart className="h-5 w-5" />
                    {wishlist.length > 0 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        {wishlist.length}
                      </motion.span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link 
                    to="/cart" 
                    className="relative p-2 text-gray-600 hover:text-yellow-600 transition-colors rounded-lg hover:bg-gray-100/50"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartState.itemCount > 0 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-black text-xs rounded-full flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        {cartState.itemCount}
                      </motion.span>
                    )}
                  </Link>

                  {/* Mobile Menu */}
                  <button 
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100/50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <AnimatePresence mode="wait">
                      {isMenuOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="lg:hidden border-t border-gray-200/50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="py-4 space-y-4 bg-white/90">
                    {/* Mobile Auth Buttons */}
                    {!isAuthenticated && (
                      <div className="flex space-x-3 px-4 pb-4 border-b border-gray-200/50">
                        <button
                          onClick={() => openAuthModal('login')}
                          className="flex-1 py-2 px-4 bg-gray-100/80 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200/80 transition-colors flex items-center justify-center space-x-2 backdrop-blur-sm"
                        >
                          <LogIn className="h-4 w-4" />
                          <span>Sign In</span>
                        </button>
                        <button
                          onClick={() => openAuthModal('register')}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Sign Up</span>
                        </button>
                      </div>
                    )}

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="px-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 text-sm backdrop-blur-sm"
                          style={{
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                          }}
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </form>
                    
                    {/* Mobile Navigation Items */}
                    <div className="px-4 space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block px-3 py-2 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm ${
                            location.pathname === item.path
                              ? 'bg-yellow-50/80 text-yellow-600'
                              : 'text-gray-700 hover:bg-gray-50/80'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;