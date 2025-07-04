import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut, Edit, Eye, Truck, CheckCircle, Clock, XCircle, Camera, Database, Users as UsersIcon } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import UserStatsPanel from '../components/UserStatsPanel';
import DatabaseControlPanel from '../components/DatabaseControlPanel';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '+91 98765 43210',
    address: '123 Sports Avenue, Mumbai, Maharashtra 400001'
  });

  const { orders } = useOrders();
  const { user, logout, updateProfile, isLoading, getUserCount } = useAuth();

  // Initialize profile data when user changes
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: '+91 98765 43210',
        address: '123 Sports Avenue, Mumbai, Maharashtra 400001'
      });
    }
  }, [user]);

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'admin', label: 'User Stats', icon: Database },
    { id: 'database', label: 'Database Control', icon: Database }, // New database control tab
  ];

  const handleSave = async () => {
    setIsUpdatingProfile(true);
    
    try {
      const result = await updateProfile({
        name: profileData.name,
        email: profileData.email
      });
      
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-primary-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-warning-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-error-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success-100 text-success-800';
      case 'shipped':
        return 'bg-primary-100 text-primary-800';
      case 'processing':
        return 'bg-warning-100 text-warning-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <User className="h-24 w-24 text-neutral-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Please sign in</h1>
          <p className="text-neutral-600 mb-8">You need to be signed in to view your profile.</p>
          <Link to="/" className="btn-primary">
            Go to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold heading-premium mb-4">My Account</h1>
          <p className="text-premium">Manage your account settings and view your orders</p>
          
          {/* User count display */}
          <div className="mt-4 inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
            <UsersIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              {getUserCount()} registered users
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card-premium p-6">
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-10 w-10 text-primary-600" />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                    <Camera className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{user.name}</h3>
                <p className="text-neutral-600">{user.email}</p>
                <div className="mt-2 text-xs text-neutral-500">
                  Member since {formatDate(user.createdAt)}
                </div>
                {user.lastLogin && (
                  <div className="mt-1 text-xs text-neutral-500">
                    Last login: {formatDate(user.lastLogin)}
                  </div>
                )}
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 border border-primary-200'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {(tab.id === 'admin' || tab.id === 'database') && (
                      <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </motion.button>
                ))}
                
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-error-600 hover:bg-error-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </motion.button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card-premium p-6">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold heading-premium">My Orders</h2>
                    <div className="text-sm text-neutral-600">
                      {orders.length} total orders
                    </div>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">No orders yet</h3>
                      <p className="text-neutral-600 mb-6">Start shopping to see your orders here!</p>
                      <Link to="/products" className="btn-primary">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-3">
                                <h3 className="text-lg font-semibold text-neutral-900">
                                  Order {order.orderNumber}
                                </h3>
                                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  <span className="capitalize">{order.status}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                                <div>
                                  <span className="font-medium">Order Date:</span>
                                  <p>{formatDate(order.date)}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Items:</span>
                                  <p>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Total:</span>
                                  <p className="text-lg font-bold text-neutral-900">₹{order.total.toFixed(2)}</p>
                                </div>
                              </div>

                              {order.trackingNumber && (
                                <div className="mt-3 text-sm">
                                  <span className="font-medium text-neutral-700">Tracking:</span>
                                  <span className="ml-2 font-mono text-primary-600">{order.trackingNumber}</span>
                                </div>
                              )}

                              {order.estimatedDelivery && order.status !== 'delivered' && (
                                <div className="mt-2 text-sm text-neutral-600">
                                  <span className="font-medium">Estimated Delivery:</span>
                                  <span className="ml-2">{formatDate(order.estimatedDelivery)}</span>
                                </div>
                              )}

                              {order.deliveredDate && (
                                <div className="mt-2 text-sm text-success-600">
                                  <span className="font-medium">Delivered on:</span>
                                  <span className="ml-2">{formatDate(order.deliveredDate)}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-3">
                              <Link
                                to={`/order/${order.id}`}
                                className="inline-flex items-center space-x-2 px-4 py-2 border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View Details</span>
                              </Link>
                              
                              {order.status === 'delivered' && (
                                <button className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                  <Package className="h-4 w-4" />
                                  <span>Reorder</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-4 overflow-x-auto">
                              {order.items.slice(0, 3).map((item) => (
                                <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-2 flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div className="text-sm">
                                    <p className="font-medium text-neutral-900 truncate max-w-32">{item.name}</p>
                                    <p className="text-neutral-600">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="text-sm text-neutral-600 flex-shrink-0">
                                  +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold heading-premium">Profile Information</h2>
                    <motion.button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isUpdatingProfile}
                    >
                      <Edit className="h-4 w-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </motion.button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="input-premium"
                          disabled={isUpdatingProfile}
                        />
                      ) : (
                        <p className="text-neutral-900 py-3">{profileData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="input-premium"
                          disabled={isUpdatingProfile}
                        />
                      ) : (
                        <p className="text-neutral-900 py-3">{profileData.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="input-premium"
                          disabled={isUpdatingProfile}
                        />
                      ) : (
                        <p className="text-neutral-900 py-3">{profileData.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          className="input-premium"
                          disabled={isUpdatingProfile}
                        />
                      ) : (
                        <p className="text-neutral-900 py-3">{profileData.address}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6">
                      <motion.button
                        onClick={handleSave}
                        disabled={isUpdatingProfile}
                        className={`btn-primary ${isUpdatingProfile ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={!isUpdatingProfile ? { scale: 1.02 } : {}}
                        whileTap={!isUpdatingProfile ? { scale: 0.98 } : {}}
                      >
                        {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold heading-premium mb-6">My Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-neutral-600 mb-6">Save your favorite items to view them here!</p>
                    <Link to="/wishlist" className="btn-primary">
                      View Wishlist
                    </Link>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold heading-premium mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                          <span className="ml-2 text-neutral-700">Email notifications for orders</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                          <span className="ml-2 text-neutral-700">Promotional emails</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">SMS notifications</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Privacy</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                          <span className="ml-2 text-neutral-700">Make profile public</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-neutral-700">Share data for analytics</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Danger Zone</h3>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                      <p className="text-sm text-gray-600 mt-2">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin/User Stats Tab */}
              {activeTab === 'admin' && (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <Database className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold heading-premium">User Statistics & Database</h2>
                  </div>
                  <UserStatsPanel />
                </div>
              )}

              {/* Database Control Tab */}
              {activeTab === 'database' && (
                <div>
                  <DatabaseControlPanel />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;