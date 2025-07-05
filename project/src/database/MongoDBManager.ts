import { User } from '../context/AuthContext';

// MongoDB-specific types and interfaces
interface MongoUser {
  _id: string;
  email: string;
  name: string;
  passwordHash: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  loginCount: number;
  profile: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    dateOfBirth?: Date;
    gender?: string;
    bio?: string;
    interests: string[];
    preferences: {
      currency: string;
      language: string;
      theme: 'light' | 'dark';
      notifications: boolean;
      favoriteCategories: string[];
    };
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    lastOrderDate?: Date;
    averageOrderValue: number;
  };
  sessions: Array<{
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    expiresAt: Date;
  }>;
}

interface MongoSearchFilters {
  role?: string;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  searchTerm?: string;
  hasOrders?: boolean;
}

interface MongoPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 1 | -1;
}

// Mock MongoDB connection for demonstration
class MongoConnection {
  private isConnected: boolean = false;
  private mockData: Map<string, MongoUser> = new Map();

  async connect(connectionString: string): Promise<void> {
    try {
      console.log(`Connecting to MongoDB: ${connectionString}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isConnected = true;
      this.initializeMockData();
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log('MongoDB disconnected');
  }

  private initializeMockData(): void {
    // Generate mock users for demonstration
    const roles: Array<'user' | 'admin' | 'moderator'> = ['user', 'admin', 'moderator'];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];

    for (let i = 0; i < 50; i++) {
      const userId = `user_${i + 1}`;
      const user: MongoUser = {
        _id: userId,
        email: `user${i + 1}@${domains[i % domains.length]}`,
        name: names[i % names.length],
        passwordHash: '$2b$10$hashedpassword',
        role: roles[i % roles.length],
        isActive: Math.random() > 0.1,
        emailVerified: Math.random() > 0.3,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        loginCount: Math.floor(Math.random() * 100),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[i % names.length])}&background=random&color=fff&size=100&rounded=true`,
        profile: {
          country: 'India',
          interests: ['sports', 'fitness'],
          preferences: {
            currency: 'INR',
            language: 'en',
            theme: 'light',
            notifications: true,
            favoriteCategories: []
          }
        },
        stats: {
          totalOrders: Math.floor(Math.random() * 20),
          totalSpent: Math.floor(Math.random() * 50000),
          loyaltyPoints: Math.floor(Math.random() * 1000),
          averageOrderValue: Math.floor(Math.random() * 5000)
        },
        sessions: []
      };

      this.mockData.set(userId, user);
    }
  }

  async findOne(collection: string, filter: any): Promise<MongoUser | null> {
    if (!this.isConnected) throw new Error('MongoDB not connected');

    for (const user of this.mockData.values()) {
      if (filter._id && user._id === filter._id) return user;
      if (filter.email && user.email === filter.email) return user;
    }
    return null;
  }

  async find(collection: string, filter: any = {}, options: any = {}): Promise<MongoUser[]> {
    if (!this.isConnected) throw new Error('MongoDB not connected');

    let results = Array.from(this.mockData.values());

    // Apply filters
    if (filter.role) {
      results = results.filter(user => user.role === filter.role);
    }
    if (filter.isActive !== undefined) {
      results = results.filter(user => user.isActive === filter.isActive);
    }
    if (filter.$text && filter.$text.$search) {
      const searchTerm = filter.$text.$search.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortField];
      results.sort((a, b) => {
        const aVal = (a as any)[sortField];
        const bVal = (b as any)[sortField];
        return sortOrder === 1 ? 
          (aVal > bVal ? 1 : -1) : 
          (aVal < bVal ? 1 : -1);
      });
    }

    // Apply pagination
    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async insertOne(collection: string, document: any): Promise<{ insertedId: string }> {
    if (!this.isConnected) throw new Error('MongoDB not connected');

    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: MongoUser = {
      _id: id,
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockData.set(id, user);
    return { insertedId: id };
  }

  async updateOne(collection: string, filter: any, update: any): Promise<{ modifiedCount: number }> {
    if (!this.isConnected) throw new Error('MongoDB not connected');

    for (const [id, user] of this.mockData) {
      if (filter._id && user._id === filter._id) {
        const updatedUser = { ...user, ...update.$set, updatedAt: new Date() };
        this.mockData.set(id, updatedUser);
        return { modifiedCount: 1 };
      }
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(collection: string, filter: any): Promise<{ deletedCount: number }> {
    if (!this.isConnected) throw new Error('MongoDB not connected');

    for (const [id, user] of this.mockData) {
      if (filter._id && user._id === filter._id) {
        this.mockData.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  }

  async countDocuments(collection: string, filter: any = {}): Promise<number> {
    const results = await this.find(collection, filter);
    return results.length;
  }

  async aggregate(collection: string, pipeline: any[]): Promise<any[]> {
    if (!this.isConnected) throw new Error('MongoDB not connected');

    // Simple aggregation simulation
    const users = Array.from(this.mockData.values());
    
    // Handle basic aggregation operations
    for (const stage of pipeline) {
      if (stage.$match) {
        // Apply match filters (simplified)
      }
      if (stage.$group) {
        // Handle grouping (simplified)
        if (stage.$group._id === null) {
          return [{
            totalUsers: users.length,
            activeUsers: users.filter(u => u.isActive).length,
            totalRevenue: users.reduce((sum, u) => sum + u.stats.totalSpent, 0)
          }];
        }
      }
    }

    return users;
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

// MongoDB Database Manager
export class MongoDBManager {
  private static instance: MongoDBManager;
  private connection: MongoConnection;
  private connectionString: string;

  private constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearupsports';
    this.connection = new MongoConnection();
  }

  static getInstance(): MongoDBManager {
    if (!MongoDBManager.instance) {
      MongoDBManager.instance = new MongoDBManager();
    }
    return MongoDBManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.connection.connect(this.connectionString);
      await this.createIndexes();
      console.log('MongoDB manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MongoDB manager:', error);
      throw error;
    }
  }

  async destroy(): Promise<void> {
    await this.connection.disconnect();
  }

  private async createIndexes(): Promise<void> {
    console.log('Creating MongoDB indexes...');
    // In production, this would create actual indexes
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Indexes created successfully');
  }

  // User Management Methods
  async createUser(userData: {
    email: string;
    name: string;
    passwordHash: string;
    role?: 'user' | 'admin' | 'moderator';
    avatar?: string;
  }): Promise<User> {
    const document = {
      email: userData.email.toLowerCase(),
      name: userData.name,
      passwordHash: userData.passwordHash,
      role: userData.role || 'user',
      avatar: userData.avatar,
      isActive: true,
      emailVerified: false,
      loginCount: 0,
      profile: {
        country: 'India',
        interests: [],
        preferences: {
          currency: 'INR',
          language: 'en',
          theme: 'light' as const,
          notifications: true,
          favoriteCategories: []
        }
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        averageOrderValue: 0
      },
      sessions: []
    };

    const result = await this.connection.insertOne('users', document);
    const user = await this.connection.findOne('users', { _id: result.insertedId });
    
    if (!user) {
      throw new Error('Failed to create user');
    }

    return this.mapMongoUserToUser(user);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.connection.findOne('users', { _id: id });
    return user ? this.mapMongoUserToUser(user) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.connection.findOne('users', { email: email.toLowerCase() });
    return user ? this.mapMongoUserToUser(user) : null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const updateDoc: any = {};

    if (updates.name !== undefined) updateDoc.name = updates.name;
    if (updates.email !== undefined) updateDoc.email = updates.email.toLowerCase();
    if (updates.role !== undefined) updateDoc.role = updates.role;
    if (updates.isActive !== undefined) updateDoc.isActive = updates.isActive;
    if (updates.avatar !== undefined) updateDoc.avatar = updates.avatar;

    if (Object.keys(updateDoc).length === 0) {
      return this.getUserById(id);
    }

    const result = await this.connection.updateOne(
      'users',
      { _id: id },
      { $set: updateDoc }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.connection.deleteOne('users', { _id: id });
    return result.deletedCount > 0;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.connection.updateOne(
      'users',
      { _id: id },
      { 
        $set: { lastLogin: new Date() },
        $inc: { loginCount: 1 }
      }
    );
  }

  // Search and filtering methods
  async searchUsers(
    filters: MongoSearchFilters = {},
    pagination: MongoPaginationOptions = { page: 1, limit: 10 }
  ): Promise<{ users: User[]; total: number }> {
    const mongoFilter: any = {};

    if (filters.role) mongoFilter.role = filters.role;
    if (filters.isActive !== undefined) mongoFilter.isActive = filters.isActive;
    if (filters.searchTerm) {
      mongoFilter.$text = { $search: filters.searchTerm };
    }
    if (filters.createdAfter || filters.createdBefore) {
      mongoFilter.createdAt = {};
      if (filters.createdAfter) mongoFilter.createdAt.$gte = filters.createdAfter;
      if (filters.createdBefore) mongoFilter.createdAt.$lte = filters.createdBefore;
    }

    // Count total documents
    const total = await this.connection.countDocuments('users', mongoFilter);

    // Get paginated results
    const skip = (pagination.page - 1) * pagination.limit;
    const sortField = pagination.sortBy || 'createdAt';
    const sortOrder = pagination.sortOrder || -1;

    const mongoUsers = await this.connection.find('users', mongoFilter, {
      skip,
      limit: pagination.limit,
      sort: { [sortField]: sortOrder }
    });

    const users = mongoUsers.map(user => this.mapMongoUserToUser(user));

    return { users, total };
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const result = await this.searchUsers({ role });
    return result.users;
  }

  // Statistics and analytics
  async getDatabaseStats(): Promise<any> {
    const aggregationPipeline = [
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          },
          moderatorUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'moderator'] }, 1, 0] }
          },
          regularUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$stats.totalSpent' },
          averageOrderValue: { $avg: '$stats.averageOrderValue' }
        }
      }
    ];

    const results = await this.connection.aggregate('users', aggregationPipeline);
    const stats = results[0] || {};

    // Calculate additional stats
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const newUsersThisWeek = await this.connection.countDocuments('users', {
      createdAt: { $gte: oneWeekAgo }
    });

    const newUsersThisMonth = await this.connection.countDocuments('users', {
      createdAt: { $gte: oneMonthAgo }
    });

    const usersWithOrders = await this.connection.countDocuments('users', {
      'stats.totalOrders': { $gt: 0 }
    });

    return {
      totalUsers: stats.totalUsers || 0,
      activeUsers: stats.activeUsers || 0,
      inactiveUsers: (stats.totalUsers || 0) - (stats.activeUsers || 0),
      adminUsers: stats.adminUsers || 0,
      moderatorUsers: stats.moderatorUsers || 0,
      regularUsers: stats.regularUsers || 0,
      newUsersThisWeek,
      newUsersThisMonth,
      usersWithOrders,
      totalRevenue: stats.totalRevenue || 0,
      averageOrderValue: stats.averageOrderValue || 0,
      storageUsed: 0, // Would be calculated based on actual database size
      maxCapacity: 1000,
      capacityUsed: Math.round(((stats.totalUsers || 0) / 1000) * 100)
    };
  }

  // Bulk operations
  async bulkCreateUsers(users: Array<{
    email: string;
    name: string;
    passwordHash: string;
    role?: 'user' | 'admin' | 'moderator';
  }>): Promise<{ created: number; errors: string[] }> {
    let created = 0;
    const errors: string[] = [];

    for (const userData of users) {
      try {
        await this.createUser(userData);
        created++;
      } catch (error) {
        errors.push(`Failed to create user ${userData.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { created, errors };
  }

  async exportUsers(): Promise<string> {
    const users = await this.connection.find('users', {}, { sort: { createdAt: -1 } });
    
    const headers = ['ID', 'Name', 'Email', 'Role', 'Active', 'Created At', 'Last Login', 'Total Orders', 'Total Spent'];
    const csvData = [
      headers.join(','),
      ...users.map(user => [
        user._id,
        `"${user.name}"`,
        user.email,
        user.role,
        user.isActive,
        user.createdAt.toISOString(),
        user.lastLogin?.toISOString() || '',
        user.stats.totalOrders,
        user.stats.totalSpent
      ].join(','))
    ].join('\n');

    return csvData;
  }

  // Backup and maintenance
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString();
    console.log(`Creating MongoDB backup at ${timestamp}`);
    
    // In production, this would use mongodump or similar
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const backupId = `mongodb_backup_${Date.now()}`;
    console.log(`MongoDB backup created with ID: ${backupId}`);
    
    return backupId;
  }

  async restoreBackup(backupId: string): Promise<void> {
    console.log(`Restoring MongoDB from backup: ${backupId}`);
    
    // In production, this would use mongorestore
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('MongoDB restored successfully');
  }

  async optimizeDatabase(): Promise<void> {
    console.log('Optimizing MongoDB performance...');
    
    // In production, this would run database optimization commands
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('MongoDB optimization completed');
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: {
      connection: boolean;
      responseTime: number;
      userCount: number;
    };
  }> {
    const startTime = Date.now();
    
    try {
      const isConnected = this.connection.isHealthy();
      const userCount = await this.connection.countDocuments('users');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        details: {
          connection: isConnected,
          responseTime,
          userCount
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          connection: false,
          responseTime: Date.now() - startTime,
          userCount: 0
        }
      };
    }
  }

  // Helper methods
  private mapMongoUserToUser(mongoUser: MongoUser): User {
    return {
      id: mongoUser._id,
      email: mongoUser.email,
      name: mongoUser.name,
      avatar: mongoUser.avatar,
      role: mongoUser.role,
      isActive: mongoUser.isActive,
      createdAt: mongoUser.createdAt.toISOString(),
      lastLogin: mongoUser.lastLogin?.toISOString(),
      preferences: mongoUser.profile.preferences,
      profile: {
        phone: mongoUser.profile.phone,
        address: mongoUser.profile.address,
        interests: mongoUser.profile.interests
      },
      stats: {
        totalOrders: mongoUser.stats.totalOrders,
        totalSpent: mongoUser.stats.totalSpent,
        loyaltyPoints: mongoUser.stats.loyaltyPoints,
        lastOrderDate: mongoUser.stats.lastOrderDate?.toISOString()
      }
    };
  }
}

export default MongoDBManager;