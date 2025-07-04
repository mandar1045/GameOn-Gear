import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseManager } from '../database/DatabaseManager';
import { MongoDBManager } from '../database/MongoDBManager';

type DatabaseType = 'sql' | 'mongodb' | 'localStorage';

interface DatabaseContextType {
  databaseType: DatabaseType;
  isConnected: boolean;
  isLoading: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  switchDatabase: (type: DatabaseType) => Promise<void>;
  getDatabaseStats: () => Promise<any>;
  createBackup: () => Promise<string>;
  restoreBackup: (backupId: string) => Promise<void>;
  optimizeDatabase: () => Promise<void>;
  healthCheck: () => Promise<any>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<{ success: boolean; imported: number; errors: string[] }>;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [databaseType, setDatabaseType] = useState<DatabaseType>('localStorage');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [currentManager, setCurrentManager] = useState<DatabaseManager | MongoDBManager | null>(null);

  useEffect(() => {
    // Initialize with localStorage by default
    setIsConnected(true);
    setConnectionStatus('connected');
  }, []);

  const switchDatabase = async (type: DatabaseType): Promise<void> => {
    setIsLoading(true);
    setConnectionStatus('connecting');

    try {
      // Disconnect current manager if exists
      if (currentManager) {
        await currentManager.destroy();
        setCurrentManager(null);
      }

      switch (type) {
        case 'sql':
          const sqlManager = DatabaseManager.getInstance();
          await sqlManager.initialize();
          setCurrentManager(sqlManager);
          break;

        case 'mongodb':
          const mongoManager = MongoDBManager.getInstance();
          await mongoManager.initialize();
          setCurrentManager(mongoManager);
          break;

        case 'localStorage':
          // localStorage doesn't need initialization
          break;

        default:
          throw new Error(`Unsupported database type: ${type}`);
      }

      setDatabaseType(type);
      setIsConnected(true);
      setConnectionStatus('connected');
      
      console.log(`Successfully switched to ${type} database`);
    } catch (error) {
      console.error(`Failed to switch to ${type} database:`, error);
      setConnectionStatus('error');
      setIsConnected(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getDatabaseStats = async (): Promise<any> => {
    if (!currentManager) {
      // Return localStorage stats
      return {
        totalUsers: 0,
        activeUsers: 0,
        databaseType: 'localStorage',
        storageUsed: 0,
        maxCapacity: 1000
      };
    }

    return await currentManager.getDatabaseStats();
  };

  const createBackup = async (): Promise<string> => {
    if (!currentManager) {
      throw new Error('No database manager available');
    }

    return await currentManager.createBackup();
  };

  const restoreBackup = async (backupId: string): Promise<void> => {
    if (!currentManager) {
      throw new Error('No database manager available');
    }

    await currentManager.restoreBackup(backupId);
  };

  const optimizeDatabase = async (): Promise<void> => {
    if (!currentManager) {
      console.log('No optimization needed for localStorage');
      return;
    }

    await currentManager.optimizeDatabase();
  };

  const healthCheck = async (): Promise<any> => {
    if (!currentManager) {
      return {
        status: 'healthy',
        details: {
          connection: true,
          responseTime: 0,
          userCount: 0,
          databaseType: 'localStorage'
        }
      };
    }

    return await currentManager.healthCheck();
  };

  const exportData = async (): Promise<string> => {
    if (!currentManager) {
      // Export localStorage data
      const data = localStorage.getItem('gearupsports_users_db_v2');
      return data || '';
    }

    return await currentManager.exportUsers();
  };

  const importData = async (data: string): Promise<{ success: boolean; imported: number; errors: string[] }> => {
    if (!currentManager) {
      // Import to localStorage
      try {
        localStorage.setItem('gearupsports_users_db_v2', data);
        return { success: true, imported: 1, errors: [] };
      } catch (error) {
        return { 
          success: false, 
          imported: 0, 
          errors: [error instanceof Error ? error.message : 'Import failed'] 
        };
      }
    }

    // Parse CSV and bulk create users
    const lines = data.split('\n');
    const users = lines.slice(1).map(line => {
      const [name, email, role] = line.split(',');
      return {
        name: name?.replace(/"/g, ''),
        email: email?.replace(/"/g, ''),
        passwordHash: '$2b$10$defaulthash', // Default hash
        role: (role?.replace(/"/g, '') as any) || 'user'
      };
    }).filter(user => user.name && user.email);

    return await currentManager.bulkCreateUsers(users);
  };

  const value: DatabaseContextType = {
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
    importData,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export default DatabaseContext;