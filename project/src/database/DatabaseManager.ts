import { User } from '../context/AuthContext';

// Database configuration
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
}

// Database query result types
interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

interface DatabaseStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  moderatorUsers: number;
  regularUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersWithOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  storageUsed: number;
  maxCapacity: number;
  capacityUsed: number;
  lastBackup?: string;
}

interface UserSearchFilters {
  role?: string;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  hasOrders?: boolean;
  searchTerm?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Mock database connection for demonstration
// In production, this would connect to PostgreSQL, MySQL, or MongoDB
class DatabaseConnection {
  private config: DatabaseConfig;
  private isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Simulate database connection
      console.log(`Connecting to database at ${this.config.host}:${this.config.port}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error('Failed to connect to database');
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log('Database disconnected');
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    // Simulate database query execution
    console.log('Executing query:', sql, params);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock response based on query type
    if (sql.includes('SELECT')) {
      return this.mockSelectQuery<T>(sql, params);
    } else if (sql.includes('INSERT')) {
      return this.mockInsertQuery<T>(sql, params);
    } else if (sql.includes('UPDATE')) {
      return this.mockUpdateQuery<T>(sql, params);
    } else if (sql.includes('DELETE')) {
      return this.mockDeleteQuery<T>(sql, params);
    }

    return { rows: [], rowCount: 0 };
  }

  private mockSelectQuery<T>(sql: string, params: any[]): QueryResult<T> {
    // Mock data for demonstration
    const mockUsers = this.generateMockUsers();
    
    if (sql.includes('COUNT(*)')) {
      return { rows: [{ count: mockUsers.length }] as T[], rowCount: 1 };
    }
    
    return { rows: mockUsers as T[], rowCount: mockUsers.length };
  }

  private mockInsertQuery<T>(sql: string, params: any[]): QueryResult<T> {
    const mockId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { rows: [{ id: mockId }] as T[], rowCount: 1 };
  }

  private mockUpdateQuery<T>(sql: string, params: any[]): QueryResult<T> {
    return { rows: [], rowCount: 1 };
  }

  private mockDeleteQuery<T>(sql: string, params: any[]): QueryResult<T> {
    return { rows: [], rowCount: 1 };
  }

  private generateMockUsers(): any[] {
    const roles = ['user', 'admin', 'moderator'];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `user_${i + 1}`,
      email: `user${i + 1}@${domains[i % domains.length]}`,
      name: names[i % names.length],
      role: roles[i % roles.length],
      is_active: Math.random() > 0.1,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_login: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      total_orders: Math.floor(Math.random() * 20),
      total_spent: Math.floor(Math.random() * 50000),
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[i % names.length])}&background=random&color=fff&size=100&rounded=true`
    }));
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

// Main Database Manager class
export class DatabaseManager {
  private static instance: DatabaseManager;
  private connection: DatabaseConnection;
  private config: DatabaseConfig;

  private constructor() {
    // Default configuration - in production, load from environment variables
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'gearupsports',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.DB_SSL === 'true',
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20')
    };

    this.connection = new DatabaseConnection(this.config);
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.connection.connect();
      await this.runMigrations();
      console.log('Database manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database manager:', error);
      throw error;
    }
  }

  async destroy(): Promise<void> {
    await this.connection.disconnect();
  }

  private async runMigrations(): Promise<void> {
    // In production, this would run actual SQL migrations
    console.log('Running database migrations...');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Migrations completed');
  }

  // User Management Methods
  async createUser(userData: {
    email: string;
    name: string;
    passwordHash: string;
    role?: string;
    avatarUrl?: string;
  }): Promise<User> {
    const sql = `
      INSERT INTO users (email, name, password_hash, role, avatar_url, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, true, false)
      RETURNING id, email, name, role, avatar_url, is_active, created_at
    `;

    const params = [
      userData.email.toLowerCase(),
      userData.name,
      userData.passwordHash,
      userData.role || 'user',
      userData.avatarUrl
    ];

    const result = await this.connection.query<User>(sql, params);
    
    if (result.rows.length === 0) {
      throw new Error('Failed to create user');
    }

    const user = result.rows[0];

    // Create user profile and stats
    await this.createUserProfile(user.id);
    await this.createUserStats(user.id);

    return this.mapDatabaseUserToUser(user);
  }

  async getUserById(id: string): Promise<User | null> {
    const sql = `
      SELECT u.*, up.address, up.city, up.state, up.country, up.preferences, up.interests,
             us.total_orders, us.total_spent, us.loyalty_points, us.last_order_date
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.id = $1
    `;

    const result = await this.connection.query<any>(sql, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapDatabaseUserToUser(result.rows[0]);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const sql = `
      SELECT u.*, up.address, up.city, up.state, up.country, up.preferences, up.interests,
             us.total_orders, us.total_spent, us.loyalty_points, us.last_order_date
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.email = $1
    `;

    const result = await this.connection.query<any>(sql, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapDatabaseUserToUser(result.rows[0]);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build dynamic update query
    if (updates.name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      params.push(updates.name);
    }
    if (updates.email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`);
      params.push(updates.email.toLowerCase());
    }
    if (updates.role !== undefined) {
      updateFields.push(`role = $${paramIndex++}`);
      params.push(updates.role);
    }
    if (updates.isActive !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      params.push(updates.isActive);
    }
    if (updates.avatar !== undefined) {
      updateFields.push(`avatar_url = $${paramIndex++}`);
      params.push(updates.avatar);
    }

    if (updateFields.length === 0) {
      return this.getUserById(id);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const sql = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id
    `;

    const result = await this.connection.query(sql, params);
    
    if (result.rowCount === 0) {
      return null;
    }

    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = $1';
    const result = await this.connection.query(sql, [id]);
    return result.rowCount > 0;
  }

  async updateLastLogin(id: string): Promise<void> {
    const sql = `
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1
      WHERE id = $1
    `;
    await this.connection.query(sql, [id]);
  }

  // Search and filtering methods
  async searchUsers(
    filters: UserSearchFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<{ users: User[]; total: number }> {
    const whereConditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (filters.role) {
      whereConditions.push(`u.role = $${paramIndex++}`);
      params.push(filters.role);
    }
    if (filters.isActive !== undefined) {
      whereConditions.push(`u.is_active = $${paramIndex++}`);
      params.push(filters.isActive);
    }
    if (filters.searchTerm) {
      whereConditions.push(`(u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`);
      params.push(`%${filters.searchTerm}%`);
      paramIndex++;
    }
    if (filters.createdAfter) {
      whereConditions.push(`u.created_at >= $${paramIndex++}`);
      params.push(filters.createdAfter);
    }
    if (filters.createdBefore) {
      whereConditions.push(`u.created_at <= $${paramIndex++}`);
      params.push(filters.createdBefore);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Count query
    const countSql = `
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `;
    const countResult = await this.connection.query<{ total: number }>(countSql, params);
    const total = parseInt(countResult.rows[0]?.total || '0');

    // Data query with pagination
    const offset = (pagination.page - 1) * pagination.limit;
    const orderBy = pagination.sortBy || 'created_at';
    const order = pagination.sortOrder || 'DESC';

    const dataSql = `
      SELECT u.*, up.address, up.city, up.state, up.country, up.preferences, up.interests,
             us.total_orders, us.total_spent, us.loyalty_points, us.last_order_date
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN user_stats us ON u.id = us.user_id
      ${whereClause}
      ORDER BY u.${orderBy} ${order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    params.push(pagination.limit, offset);
    const dataResult = await this.connection.query<any>(dataSql, params);

    const users = dataResult.rows.map(row => this.mapDatabaseUserToUser(row));

    return { users, total };
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const result = await this.searchUsers({ role });
    return result.users;
  }

  // Statistics and analytics
  async getDatabaseStats(): Promise<DatabaseStats> {
    const queries = [
      'SELECT COUNT(*) as total_users FROM users',
      'SELECT COUNT(*) as active_users FROM users WHERE is_active = true',
      'SELECT COUNT(*) as admin_users FROM users WHERE role = \'admin\'',
      'SELECT COUNT(*) as moderator_users FROM users WHERE role = \'moderator\'',
      'SELECT COUNT(*) as regular_users FROM users WHERE role = \'user\'',
      `SELECT COUNT(*) as new_users_week FROM users WHERE created_at >= NOW() - INTERVAL '7 days'`,
      `SELECT COUNT(*) as new_users_month FROM users WHERE created_at >= NOW() - INTERVAL '30 days'`,
      'SELECT COUNT(*) as users_with_orders FROM user_stats WHERE total_orders > 0',
      'SELECT COALESCE(SUM(total_spent), 0) as total_revenue FROM user_stats',
      'SELECT COALESCE(AVG(total_spent), 0) as avg_order_value FROM user_stats WHERE total_orders > 0'
    ];

    const results = await Promise.all(
      queries.map(query => this.connection.query<any>(query))
    );

    const [
      totalUsers, activeUsers, adminUsers, moderatorUsers, regularUsers,
      newUsersWeek, newUsersMonth, usersWithOrders, totalRevenue, avgOrderValue
    ] = results.map(r => r.rows[0]);

    return {
      totalUsers: parseInt(totalUsers.total_users || '0'),
      activeUsers: parseInt(activeUsers.active_users || '0'),
      inactiveUsers: parseInt(totalUsers.total_users || '0') - parseInt(activeUsers.active_users || '0'),
      adminUsers: parseInt(adminUsers.admin_users || '0'),
      moderatorUsers: parseInt(moderatorUsers.moderator_users || '0'),
      regularUsers: parseInt(regularUsers.regular_users || '0'),
      newUsersThisWeek: parseInt(newUsersWeek.new_users_week || '0'),
      newUsersThisMonth: parseInt(newUsersMonth.new_users_month || '0'),
      usersWithOrders: parseInt(usersWithOrders.users_with_orders || '0'),
      totalRevenue: parseFloat(totalRevenue.total_revenue || '0'),
      averageOrderValue: parseFloat(avgOrderValue.avg_order_value || '0'),
      storageUsed: 0, // Would be calculated based on actual database size
      maxCapacity: 1000,
      capacityUsed: Math.round((parseInt(totalUsers.total_users || '0') / 1000) * 100)
    };
  }

  // Bulk operations
  async bulkCreateUsers(users: Array<{
    email: string;
    name: string;
    passwordHash: string;
    role?: string;
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
    const sql = `
      SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at, u.last_login,
             us.total_orders, us.total_spent
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      ORDER BY u.created_at DESC
    `;

    const result = await this.connection.query<any>(sql);
    
    const headers = ['ID', 'Name', 'Email', 'Role', 'Active', 'Created At', 'Last Login', 'Total Orders', 'Total Spent'];
    const csvData = [
      headers.join(','),
      ...result.rows.map(user => [
        user.id,
        `"${user.name}"`,
        user.email,
        user.role,
        user.is_active,
        user.created_at,
        user.last_login || '',
        user.total_orders || 0,
        user.total_spent || 0
      ].join(','))
    ].join('\n');

    return csvData;
  }

  // Backup and maintenance
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString();
    console.log(`Creating database backup at ${timestamp}`);
    
    // In production, this would create an actual database backup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const backupId = `backup_${Date.now()}`;
    console.log(`Backup created with ID: ${backupId}`);
    
    return backupId;
  }

  async restoreBackup(backupId: string): Promise<void> {
    console.log(`Restoring database from backup: ${backupId}`);
    
    // In production, this would restore from an actual backup
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Database restored successfully');
  }

  async optimizeDatabase(): Promise<void> {
    console.log('Optimizing database performance...');
    
    // In production, this would run VACUUM, ANALYZE, and other optimization commands
    const optimizationQueries = [
      'VACUUM ANALYZE users',
      'VACUUM ANALYZE user_profiles',
      'VACUUM ANALYZE user_stats',
      'REINDEX INDEX idx_users_email',
      'REINDEX INDEX idx_users_role'
    ];

    for (const query of optimizationQueries) {
      await this.connection.query(query);
    }
    
    console.log('Database optimization completed');
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: {
      connection: boolean;
      responseTime: number;
      userCount: number;
      lastBackup?: string;
    };
  }> {
    const startTime = Date.now();
    
    try {
      const isConnected = this.connection.isHealthy();
      const userCountResult = await this.connection.query('SELECT COUNT(*) as count FROM users');
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        details: {
          connection: isConnected,
          responseTime,
          userCount: parseInt(userCountResult.rows[0]?.count || '0')
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
  private async createUserProfile(userId: string): Promise<void> {
    const sql = `
      INSERT INTO user_profiles (user_id, preferences)
      VALUES ($1, $2)
    `;
    const defaultPreferences = {
      currency: 'INR',
      language: 'en',
      theme: 'light',
      notifications: true
    };

    await this.connection.query(sql, [userId, JSON.stringify(defaultPreferences)]);
  }

  private async createUserStats(userId: string): Promise<void> {
    const sql = `
      INSERT INTO user_stats (user_id, total_orders, total_spent, loyalty_points)
      VALUES ($1, 0, 0.00, 0)
    `;

    await this.connection.query(sql, [userId]);
  }

  private mapDatabaseUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar_url,
      role: dbUser.role,
      isActive: dbUser.is_active,
      createdAt: dbUser.created_at,
      lastLogin: dbUser.last_login,
      preferences: dbUser.preferences || {
        favoriteCategories: [],
        currency: 'INR',
        notifications: true,
        theme: 'light',
        language: 'en'
      },
      profile: {
        phone: dbUser.phone,
        address: dbUser.address,
        interests: dbUser.interests || []
      },
      stats: {
        totalOrders: dbUser.total_orders || 0,
        totalSpent: parseFloat(dbUser.total_spent || '0'),
        loyaltyPoints: dbUser.loyalty_points || 0,
        lastOrderDate: dbUser.last_order_date
      }
    };
  }
}

export default DatabaseManager;