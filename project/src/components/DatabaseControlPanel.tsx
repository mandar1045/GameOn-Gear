import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Server, HardDrive, Activity, Settings, Download, Upload, 
  RefreshCw, AlertTriangle, CheckCircle, Clock, Zap, Shield, 
  BarChart3, TrendingUp, Users, Cpu, Monitor, Wifi, WifiOff
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

const DatabaseControlPanel: React.FC = () => {
  const {
    databaseType,
    isConnected,
    isLoading,
    connectionStatus,
    switchDatabase,
    getDatabaseStats,
    createBackup,
    restoreBackup,
    optimizeDatabase,
    healthCheck,
    exportData,
    importData
  } = useDatabase();

  const [stats, setStats] = useState<any>({});
  const [health, setHealth] = useState<any>({});
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFileData, setImportFileData] = useState('');
  const [isOperating, setIsOperating] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [databaseType, isConnected]);

  const refreshData = async () => {
    if (!isConnected) return;

    try {
      const [statsData, healthData] = await Promise.all([
        getDatabaseStats(),
        healthCheck()
      ]);
      setStats(statsData);
      setHealth(healthData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh database data:', error);
    }
  };

  const handleDatabaseSwitch = async (type: 'sql' | 'mongodb' | 'localStorage') => {
    setIsOperating(true);
    try {
      await switchDatabase(type);
      await refreshData();
    } catch (error) {
      console.error('Failed to switch database:', error);
      alert(`Failed to switch to ${type} database. Check console for details.`);
    } finally {
      setIsOperating(false);
    }
  };

  const handleBackup = async () => {
    setIsOperating(true);
    try {
      const backupId = await createBackup();
      alert(`Backup created successfully: ${backupId}`);
      setShowBackupModal(false);
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Backup failed. Check console for details.');
    } finally {
      setIsOperating(false);
    }
  };

  const handleOptimize = async () => {
    setIsOperating(true);
    try {
      await optimizeDatabase();
      alert('Database optimization completed successfully');
      await refreshData();
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Optimization failed. Check console for details.');
    } finally {
      setIsOperating(false);
    }
  };

  const handleExport = async () => {
    setIsOperating(true);
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_export_${databaseType}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Check console for details.');
    } finally {
      setIsOperating(false);
    }
  };

  const handleImport = async () => {
    if (!importFileData.trim()) return;

    setIsOperating(true);
    try {
      const result = await importData(importFileData);
      alert(`Import completed! Imported: ${result.imported} records. Errors: ${result.errors.length}`);
      if (result.errors.length > 0) {
        console.log('Import errors:', result.errors);
      }
      setShowImportModal(false);
      setImportFileData('');
      await refreshData();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Check console for details.');
    } finally {
      setIsOperating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'connecting': return <Clock className="h-5 w-5 text-yellow-600 animate-spin" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <WifiOff className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Database Control Panel</h2>
            <p className="text-gray-600">Manage your database connections and operations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon(connectionStatus)}
          <span className={`font-medium ${getStatusColor(connectionStatus)}`}>
            {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Database Type Selector */}
      <motion.div 
        className="card-premium p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              type: 'localStorage', 
              name: 'Local Storage', 
              description: 'Browser-based storage (current)',
              icon: HardDrive,
              color: 'blue'
            },
            { 
              type: 'sql', 
              name: 'SQL Database', 
              description: 'PostgreSQL/MySQL with full ACID compliance',
              icon: Server,
              color: 'green'
            },
            { 
              type: 'mongodb', 
              name: 'MongoDB', 
              description: 'NoSQL document database with flexibility',
              icon: Database,
              color: 'purple'
            }
          ].map((db) => (
            <motion.button
              key={db.type}
              onClick={() => handleDatabaseSwitch(db.type as any)}
              disabled={isOperating || isLoading || databaseType === db.type}
              className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                databaseType === db.type
                  ? `border-${db.color}-500 bg-${db.color}-50`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isOperating || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              whileHover={databaseType !== db.type && !isOperating ? { scale: 1.02 } : {}}
              whileTap={databaseType !== db.type && !isOperating ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-3 mb-2">
                <db.icon className={`h-6 w-6 ${databaseType === db.type ? `text-${db.color}-600` : 'text-gray-600'}`} />
                <span className={`font-semibold ${databaseType === db.type ? `text-${db.color}-900` : 'text-gray-900'}`}>
                  {db.name}
                </span>
                {databaseType === db.type && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 text-left">{db.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Connection Status & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
            <button
              onClick={refreshData}
              disabled={isOperating}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${isOperating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database Type:</span>
              <span className="font-semibold capitalize">{databaseType}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(connectionStatus)}
                <span className={`font-semibold ${getStatusColor(connectionStatus)}`}>
                  {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </span>
              </div>
            </div>

            {health.details && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-semibold">{health.details.responseTime}ms</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">User Count:</span>
                  <span className="font-semibold">{health.details.userCount}</span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Refresh:</span>
              <span className="text-sm text-gray-500">
                {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card-premium p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-900">{stats.totalUsers || 0}</div>
              <div className="text-xs text-blue-700">Total Users</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Activity className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-green-900">{stats.activeUsers || 0}</div>
              <div className="text-xs text-green-700">Active Users</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-purple-900">{stats.newUsersThisMonth || 0}</div>
              <div className="text-xs text-purple-700">New This Month</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-orange-900">{stats.capacityUsed || 0}%</div>
              <div className="text-xs text-orange-700">Capacity Used</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Operations Panel */}
      <motion.div 
        className="card-premium p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Operations</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowBackupModal(true)}
            disabled={isOperating || !isConnected}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Backup</span>
          </button>

          <button
            onClick={handleOptimize}
            disabled={isOperating || !isConnected}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="h-6 w-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium">Optimize</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isOperating || !isConnected}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium">Export</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            disabled={isOperating || !isConnected}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Import</span>
          </button>
        </div>
      </motion.div>

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowBackupModal(false)} />
            
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Database Backup</h3>
                <p className="text-sm text-gray-600 mb-6">
                  This will create a backup of your current database. The backup can be used to restore your data later.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBackupModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBackup}
                    disabled={isOperating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOperating ? 'Creating...' : 'Create Backup'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowImportModal(false)} />
            
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Import Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Paste CSV data with columns: Name, Email, Role (optional)
                </p>
                <textarea
                  value={importFileData}
                  onChange={(e) => setImportFileData(e.target.value)}
                  placeholder="Name,Email,Role&#10;John Doe,john@example.com,user&#10;Jane Smith,jane@example.com,moderator"
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importFileData.trim() || isOperating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOperating ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseControlPanel;