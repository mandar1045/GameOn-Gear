import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'register'>('login');

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <motion.div 
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xl">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // If user is authenticated, show the protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If user is not authenticated, show the authentication gate
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating orbs */}
      <motion.div 
        className="absolute top-20 left-1/4 w-4 h-4 bg-white/20 rounded-full"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-32 right-1/3 w-3 h-3 bg-white/15 rounded-full"
        animate={{ 
          y: [0, -25, 0],
          opacity: [0.2, 0.7, 0.2]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-1/3 w-5 h-5 bg-white/10 rounded-full"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-white/20 rounded-full transform rotate-12"></div>
                <div className="absolute inset-2 bg-white/30 rounded-full transform -rotate-12"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-4xl font-bold">
                GearUp<span className="text-yellow-400">Sports</span>
              </h1>
              <div className="text-sm text-white/80 font-medium tracking-wider">PREMIUM GEAR</div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-6">
              <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Welcome to
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                GearUp Sports
              </span>
            </h2>

            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              Your premier destination for professional sports equipment. 
              Please sign in or create an account to access our exclusive collection.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
                <p className="text-blue-100 text-sm">Your account and data are protected with enterprise-level security.</p>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personal Experience</h3>
                <p className="text-blue-100 text-sm">Customized recommendations and order history just for you.</p>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Access</h3>
                <p className="text-blue-100 text-sm">Exclusive deals and early access to new products.</p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 min-w-[200px]"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </motion.button>

              <motion.button
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 min-w-[200px]"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="h-5 w-5" />
                <span>Create Account</span>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </motion.button>
            </motion.div>

            {/* Demo Credentials */}
            <motion.div 
              className="mt-8 p-4 bg-blue-800/30 backdrop-blur-md rounded-xl border border-blue-400/30 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-sm text-blue-200 mb-2">
                <strong>Demo Account:</strong>
              </p>
              <p className="text-xs text-blue-300 font-mono">
                Email: demo@gearupsports.com<br />
                Password: demo123
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default ProtectedRoute;