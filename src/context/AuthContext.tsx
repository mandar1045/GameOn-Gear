import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  role: 'user' | 'admin' | 'moderator';
  preferences?: {
    favoriteCategories: string[];
    currency: string;
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
  profile?: {
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    interests?: string[];
  };
  stats?: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    loyaltyPoints: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  getAllUsers: () => User[];
  getUserCount: () => number;
  searchUsers: (query: string) => User[];
  getUsersByRole: (role: string) => User[];
  getUsersCreatedInRange: (startDate: Date, endDate: Date) => User[];
  updateUserRole: (userId: string, role: User['role']) => Promise<{ success: boolean; error?: string }>;
  deactivateUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  activateUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  exportUsers: () => string;
  importUsers: (csvData: string) => Promise<{ success: boolean; imported: number; errors: string[] }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Enhanced User Database Management with Performance Optimizations
class EnhancedUserDatabase {
  private static instance: EnhancedUserDatabase;
  private users: Map<string, User & { password: string }> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private roleIndex: Map<string, Set<string>> = new Map();
  private nameIndex: Map<string, Set<string>> = new Map();
  private readonly STORAGE_KEY = 'gearupsports_users_db_v2';
  private readonly CURRENT_USER_KEY = 'gearupsports_current_user_v2';
  private readonly INDEX_KEY = 'gearupsports_db_indexes_v2';
  private readonly MAX_USERS = 1000; // Increased capacity
  private readonly BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private backupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultUsers();
    this.startAutoBackup();
    this.buildIndexes();
  }

  static getInstance(): EnhancedUserDatabase {
    if (!EnhancedUserDatabase.instance) {
      EnhancedUserDatabase.instance = new EnhancedUserDatabase();
    }
    return EnhancedUserDatabase.instance;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const indexes = localStorage.getItem(this.INDEX_KEY);
      
      if (stored) {
        const data = JSON.parse(stored);
        this.users = new Map(data.users || []);
        this.emailIndex = new Map(data.emailIndex || []);
      }

      if (indexes) {
        const indexData = JSON.parse(indexes);
        this.roleIndex = new Map(indexData.roleIndex?.map(([k, v]: [string, string[]]) => [k, new Set(v)]) || []);
        this.nameIndex = new Map(indexData.nameIndex?.map(([k, v]: [string, string[]]) => [k, new Set(v)]) || []);
      }
    } catch (error) {
      console.error('Error loading user database:', error);
      this.users.clear();
      this.emailIndex.clear();
      this.roleIndex.clear();
      this.nameIndex.clear();
    }
  }

  private saveToStorage(): void {
    try {
      // Check storage quota
      if (this.users.size > this.MAX_USERS) {
        console.warn(`User limit reached: ${this.users.size}/${this.MAX_USERS}`);
        return;
      }

      const data = {
        users: Array.from(this.users.entries()),
        emailIndex: Array.from(this.emailIndex.entries()),
        lastUpdated: new Date().toISOString(),
        version: '2.0'
      };

      const indexData = {
        roleIndex: Array.from(this.roleIndex.entries()).map(([k, v]) => [k, Array.from(v)]),
        nameIndex: Array.from(this.nameIndex.entries()).map(([k, v]) => [k, Array.from(v)]),
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(indexData));
    } catch (error) {
      console.error('Error saving user database:', error);
      // Try to free up space by removing old data
      this.cleanupOldData();
    }
  }

  private buildIndexes(): void {
    this.roleIndex.clear();
    this.nameIndex.clear();

    for (const [userId, user] of this.users) {
      // Role index
      if (!this.roleIndex.has(user.role)) {
        this.roleIndex.set(user.role, new Set());
      }
      this.roleIndex.get(user.role)!.add(userId);

      // Name index for search
      const nameTokens = user.name.toLowerCase().split(' ');
      nameTokens.forEach(token => {
        if (!this.nameIndex.has(token)) {
          this.nameIndex.set(token, new Set());
        }
        this.nameIndex.get(token)!.add(userId);
      });
    }
  }

  private startAutoBackup(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }
    
    this.backupTimer = setInterval(() => {
      this.createBackup();
    }, this.BACKUP_INTERVAL);
  }

  private createBackup(): void {
    try {
      const backupData = {
        users: Array.from(this.users.entries()),
        timestamp: new Date().toISOString(),
        userCount: this.users.size
      };
      
      const backupKey = `gearupsports_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Keep only last 3 backups
      this.cleanupOldBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  private cleanupOldBackups(): void {
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('gearupsports_backup_'))
      .sort()
      .reverse();

    // Keep only the 3 most recent backups
    backupKeys.slice(3).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  private cleanupOldData(): void {
    // Remove inactive users older than 2 years
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    for (const [userId, user] of this.users) {
      const lastActivity = user.lastLogin ? new Date(user.lastLogin) : new Date(user.createdAt);
      if (!user.isActive && lastActivity < twoYearsAgo) {
        this.deleteUser(userId);
      }
    }
  }

  private initializeDefaultUsers(): void {
    // Add demo users if not exists
    const defaultUsers = [
      {
        email: 'demo@gearupsports.com',
        name: 'Demo User',
        password: 'demo123',
        role: 'user' as const,
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        email: 'admin@gearupsports.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'admin' as const,
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        email: 'moderator@gearupsports.com',
        name: 'Moderator User',
        password: 'mod123',
        role: 'moderator' as const,
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ];

    defaultUsers.forEach(userData => {
      if (!this.emailIndex.has(userData.email)) {
        this.createUser(userData);
      }
    });

    // Generate sample users for testing (up to 50 sample users)
    this.generateSampleUsers(47); // 47 + 3 default = 50 total
  }

  private generateSampleUsers(count: number): void {
    const firstNames = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Anita', 'Karan', 'Meera', 'Rohan', 'Kavya'];
    const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Joshi', 'Reddy', 'Nair', 'Agarwal', 'Mehta'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
      
      if (!this.emailIndex.has(email)) {
        this.createUser({
          email,
          name: `${firstName} ${lastName}`,
          password: 'user123',
          role: 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=random&color=fff&size=100&rounded=true`
        });
      }
    }
  }

  createUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: User['role'];
    avatar?: string;
  }): User {
    if (this.users.size >= this.MAX_USERS) {
      throw new Error(`Maximum user limit reached (${this.MAX_USERS})`);
    }

    const userId = this.generateUserId();
    const now = new Date().toISOString();
    
    const user: User & { password: string } = {
      id: userId,
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      password: userData.password,
      createdAt: now,
      isActive: true,
      role: userData.role || 'user',
      avatar: userData.avatar || this.generateAvatar(userData.name),
      preferences: {
        favoriteCategories: [],
        currency: 'INR',
        notifications: true,
        theme: 'light',
        language: 'en'
      },
      profile: {
        interests: []
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0
      }
    };

    this.users.set(userId, user);
    this.emailIndex.set(user.email, userId);
    this.updateIndexes(userId, user);
    this.saveToStorage();

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private updateIndexes(userId: string, user: User): void {
    // Update role index
    if (!this.roleIndex.has(user.role)) {
      this.roleIndex.set(user.role, new Set());
    }
    this.roleIndex.get(user.role)!.add(userId);

    // Update name index
    const nameTokens = user.name.toLowerCase().split(' ');
    nameTokens.forEach(token => {
      if (!this.nameIndex.has(token)) {
        this.nameIndex.set(token, new Set());
      }
      this.nameIndex.get(token)!.add(userId);
    });
  }

  searchUsers(query: string): User[] {
    const searchTerms = query.toLowerCase().split(' ');
    const matchingUserIds = new Set<string>();

    searchTerms.forEach(term => {
      // Search in name index
      for (const [token, userIds] of this.nameIndex) {
        if (token.includes(term)) {
          userIds.forEach(id => matchingUserIds.add(id));
        }
      }

      // Search in email
      for (const [email, userId] of this.emailIndex) {
        if (email.includes(term)) {
          matchingUserIds.add(userId);
        }
      }
    });

    return Array.from(matchingUserIds)
      .map(id => this.findUserById(id))
      .filter(user => user !== null) as User[];
  }

  getUsersByRole(role: string): User[] {
    const userIds = this.roleIndex.get(role) || new Set();
    return Array.from(userIds)
      .map(id => this.findUserById(id))
      .filter(user => user !== null) as User[];
  }

  getUsersCreatedInRange(startDate: Date, endDate: Date): User[] {
    return Array.from(this.users.values())
      .filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= startDate && createdAt <= endDate;
      })
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
  }

  updateUserRole(userId: string, newRole: User['role']): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    // Remove from old role index
    const oldRoleSet = this.roleIndex.get(user.role);
    if (oldRoleSet) {
      oldRoleSet.delete(userId);
    }

    // Update user role
    user.role = newRole;

    // Add to new role index
    if (!this.roleIndex.has(newRole)) {
      this.roleIndex.set(newRole, new Set());
    }
    this.roleIndex.get(newRole)!.add(userId);

    this.users.set(userId, user);
    this.saveToStorage();
    return true;
  }

  deactivateUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    user.isActive = false;
    this.users.set(userId, user);
    this.saveToStorage();
    return true;
  }

  activateUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    user.isActive = true;
    this.users.set(userId, user);
    this.saveToStorage();
    return true;
  }

  exportUsers(): string {
    const users = this.getAllUsers();
    const headers = ['ID', 'Name', 'Email', 'Role', 'Created At', 'Last Login', 'Active', 'Total Orders', 'Total Spent'];
    
    const csvData = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.name}"`,
        user.email,
        user.role,
        user.createdAt,
        user.lastLogin || '',
        user.isActive,
        user.stats?.totalOrders || 0,
        user.stats?.totalSpent || 0
      ].join(','))
    ].join('\n');

    return csvData;
  }

  importUsers(csvData: string): { imported: number; errors: string[] } {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const errors: string[] = [];
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',');
        if (values.length < 3) continue;

        const email = values[2]?.replace(/"/g, '');
        const name = values[1]?.replace(/"/g, '');
        
        if (!email || !name) {
          errors.push(`Line ${i + 1}: Missing required fields`);
          continue;
        }

        if (this.emailIndex.has(email)) {
          errors.push(`Line ${i + 1}: Email ${email} already exists`);
          continue;
        }

        this.createUser({
          email,
          name,
          password: 'imported123', // Default password for imported users
          role: (values[3] as User['role']) || 'user'
        });

        imported++;
      } catch (error) {
        errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { imported, errors };
  }

  // Existing methods with performance improvements
  findUserByEmail(email: string): (User & { password: string }) | null {
    const userId = this.emailIndex.get(email.toLowerCase().trim());
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  findUserById(id: string): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    // Handle email change
    if (updates.email && updates.email !== user.email) {
      const newEmail = updates.email.toLowerCase().trim();
      
      if (this.emailIndex.has(newEmail)) {
        throw new Error('Email already exists');
      }
      
      this.emailIndex.delete(user.email);
      this.emailIndex.set(newEmail, id);
    }

    // Handle role change
    if (updates.role && updates.role !== user.role) {
      const oldRoleSet = this.roleIndex.get(user.role);
      if (oldRoleSet) {
        oldRoleSet.delete(id);
      }

      if (!this.roleIndex.has(updates.role)) {
        this.roleIndex.set(updates.role, new Set());
      }
      this.roleIndex.get(updates.role)!.add(id);
    }

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    this.saveToStorage();

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  updateLastLogin(id: string): void {
    const user = this.users.get(id);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.users.set(id, user);
      this.saveToStorage();
    }
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  getUserCount(): number {
    return this.users.size;
  }

  deleteUser(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;

    // Remove from indexes
    this.emailIndex.delete(user.email);
    
    const roleSet = this.roleIndex.get(user.role);
    if (roleSet) {
      roleSet.delete(id);
    }

    const nameTokens = user.name.toLowerCase().split(' ');
    nameTokens.forEach(token => {
      const nameSet = this.nameIndex.get(token);
      if (nameSet) {
        nameSet.delete(id);
        if (nameSet.size === 0) {
          this.nameIndex.delete(token);
        }
      }
    });

    this.users.delete(id);
    this.saveToStorage();
    return true;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=100&rounded=true`;
  }

  // Session management
  saveCurrentUser(user: User): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      localStorage.removeItem(this.CURRENT_USER_KEY);
      return null;
    }
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Enhanced statistics
  getStats() {
    const users = this.getAllUsers();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeUsers = users.filter(u => u.isActive);
    const adminUsers = users.filter(u => u.role === 'admin');
    const moderatorUsers = users.filter(u => u.role === 'moderator');

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      inactiveUsers: users.length - activeUsers.length,
      adminUsers: adminUsers.length,
      moderatorUsers: moderatorUsers.length,
      regularUsers: users.filter(u => u.role === 'user').length,
      newUsersThisWeek: users.filter(u => new Date(u.createdAt) > oneWeekAgo).length,
      newUsersThisMonth: users.filter(u => new Date(u.createdAt) > oneMonthAgo).length,
      usersWithOrders: users.filter(u => (u.stats?.totalOrders || 0) > 0).length,
      averageOrderValue: users.reduce((sum, u) => sum + (u.stats?.totalSpent || 0), 0) / Math.max(users.filter(u => (u.stats?.totalOrders || 0) > 0).length, 1),
      totalRevenue: users.reduce((sum, u) => sum + (u.stats?.totalSpent || 0), 0),
      storageUsed: Math.round((JSON.stringify(Array.from(this.users.entries())).length / 1024 / 1024) * 100) / 100, // MB
      maxCapacity: this.MAX_USERS,
      capacityUsed: Math.round((users.length / this.MAX_USERS) * 100)
    };
  }

  // Cleanup method
  destroy(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userDB = EnhancedUserDatabase.getInstance();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = userDB.getCurrentUser();
        if (savedUser) {
          const currentUser = userDB.findUserById(savedUser.id);
          if (currentUser && currentUser.isActive) {
            setUser(currentUser);
          } else {
            userDB.clearCurrentUser();
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        userDB.clearCurrentUser();
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(checkSession, 300);
  }, [userDB]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      userDB.destroy();
    };
  }, [userDB]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const foundUser = userDB.findUserByEmail(email);
      
      if (!foundUser || foundUser.password !== password) {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }

      if (!foundUser.isActive) {
        setIsLoading(false);
        return { success: false, error: 'Account is deactivated. Please contact support.' };
      }

      userDB.updateLastLogin(foundUser.id);
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      userDB.saveCurrentUser(userWithoutPassword);
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const existingUser = userDB.findUserByEmail(email);
      if (existingUser) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists' };
      }

      if (!name.trim()) {
        setIsLoading(false);
        return { success: false, error: 'Name is required' };
      }

      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setIsLoading(false);
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (password.length < 6) {
        setIsLoading(false);
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const newUser = userDB.createUser({
        email,
        name,
        password,
        role: 'user'
      });

      setUser(newUser);
      userDB.saveCurrentUser(newUser);
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An error occurred during registration' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    userDB.clearCurrentUser();
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const updatedUser = userDB.updateUser(user.id, updates);
      if (!updatedUser) {
        setIsLoading(false);
        return { success: false, error: 'User not found' };
      }

      setUser(updatedUser);
      userDB.saveCurrentUser(updatedUser);
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  };

  const getAllUsers = (): User[] => {
    return userDB.getAllUsers();
  };

  const getUserCount = (): number => {
    return userDB.getUserCount();
  };

  const searchUsers = (query: string): User[] => {
    return userDB.searchUsers(query);
  };

  const getUsersByRole = (role: string): User[] => {
    return userDB.getUsersByRole(role);
  };

  const getUsersCreatedInRange = (startDate: Date, endDate: Date): User[] => {
    return userDB.getUsersCreatedInRange(startDate, endDate);
  };

  const updateUserRole = async (userId: string, role: User['role']): Promise<{ success: boolean; error?: string }> => {
    try {
      const success = userDB.updateUserRole(userId, role);
      return { success };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update user role' };
    }
  };

  const deactivateUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const success = userDB.deactivateUser(userId);
      return { success };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to deactivate user' };
    }
  };

  const activateUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const success = userDB.activateUser(userId);
      return { success };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to activate user' };
    }
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const success = userDB.deleteUser(userId);
      return { success };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete user' };
    }
  };

  const exportUsers = (): string => {
    return userDB.exportUsers();
  };

  const importUsers = async (csvData: string): Promise<{ success: boolean; imported: number; errors: string[] }> => {
    try {
      const result = userDB.importUsers(csvData);
      return { success: true, ...result };
    } catch (error) {
      return { 
        success: false, 
        imported: 0, 
        errors: [error instanceof Error ? error.message : 'Import failed'] 
      };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    getAllUsers,
    getUserCount,
    searchUsers,
    getUsersByRole,
    getUsersCreatedInRange,
    updateUserRole,
    deactivateUser,
    activateUser,
    deleteUser,
    exportUsers,
    importUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { EnhancedUserDatabase };