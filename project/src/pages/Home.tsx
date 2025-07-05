import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Trophy, Users, Shield } from 'lucide-react';
import { categories } from '../data/products';

const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Content */}
            <motion.div className="text-white" variants={itemVariants}>
              <motion.div 
                className="flex items-center space-x-2 mb-6"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-yellow-400 font-semibold">Trusted by 100,000+ athletes</span>
              </motion.div>

              <motion.h1 
                className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
                variants={itemVariants}
              >
                Gear Up Your
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Athletic Game
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                Discover premium sports equipment for every sport. From football to basketball, 
                tennis to swimming - everything you need to dominate your game.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-12"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/products"
                    className="group btn-accent flex items-center justify-center"
                  >
                    Shop All Sports
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/about"
                    className="btn-outline border-white text-white hover:bg-white hover:text-black"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-8"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <div className="text-2xl font-bold text-yellow-400">3200+</div>
                  <div className="text-gray-300">Premium Products</div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="text-2xl font-bold text-yellow-400">100k+</div>
                  <div className="text-gray-300">Happy Athletes</div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="text-2xl font-bold text-yellow-400">24/7</div>
                  <div className="text-gray-300">Expert Support</div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <motion.div 
                className="relative z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="animate-float"
              >
                <img
                  src="https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Professional Sports Equipment"
                  className="w-full h-auto rounded-lg shadow-premium-lg"
                />
              </motion.div>
              
              {/* Floating Cards */}
              <motion.div 
                className="absolute -top-6 -left-6 card-premium p-4 z-20"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Premium Quality</div>
                    <div className="text-sm text-gray-600">Professional Grade</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-6 -right-6 card-premium p-4 z-20"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Free Shipping</div>
                    <div className="text-sm text-gray-600">Orders over ₹8,000</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl heading-premium mb-4"
              variants={itemVariants}
            >
              Shop by Sport
            </motion.h2>
            <motion.p 
              className="text-lg text-premium max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Find the perfect equipment for your favorite sport. Professional-grade gear 
              trusted by athletes worldwide.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.slice(0, 8).map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Link to={`/products/${category.id}`}>
                  <div className="card-premium hover-lift overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg heading-premium mb-2 group-hover:text-yellow-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-premium mb-3 text-sm">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="badge-premium text-xs">
                          {category.productCount} products
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center p-6 card-premium hover-lift"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg heading-premium mb-3">Premium Quality</h3>
              <p className="text-premium text-sm">
                Professional-grade equipment used by top athletes worldwide. 
                Every product meets the highest quality standards.
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-6 card-premium hover-lift"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg heading-premium mb-3">Expert Support</h3>
              <p className="text-premium text-sm">
                Our team of sports experts is here to help you find the perfect 
                equipment for your needs and skill level.
              </p>
            </motion.div>

            <motion.div 
              className="text-center p-6 card-premium hover-lift"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg heading-premium mb-3">Satisfaction Guarantee</h3>
              <p className="text-premium text-sm">
                30-day return policy and lifetime warranty on select products. 
                Your satisfaction is our top priority.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;