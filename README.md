# GearUp Sports - Database Management System

A comprehensive sports equipment e-commerce platform with advanced database management capabilities supporting 500+ users.

## 🚀 Database Features

### **Multiple Database Support**
- **Local Storage**: Browser-based storage (default)
- **SQL Database**: PostgreSQL/MySQL with full ACID compliance
- **MongoDB**: NoSQL document database with flexibility

### **Advanced User Management**
- **Role-based Access Control**: Admin, Moderator, User roles
- **User Status Management**: Active/Inactive user control
- **Bulk Operations**: Import/Export users via CSV
- **Advanced Search**: Full-text search with filters
- **Pagination**: Efficient handling of large user lists

### **Performance Optimizations**
- **Indexed Queries**: Fast search and retrieval
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized for 500+ users
- **Automatic Backups**: Scheduled backup creation
- **Database Health Monitoring**: Real-time status checks

### **Security Features**
- **Password Hashing**: Secure password storage
- **Session Management**: Secure user sessions
- **Audit Logging**: Track user activities
- **Data Validation**: Input sanitization and validation
- **Role-based Permissions**: Granular access control

## 📊 Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- name (VARCHAR)
- password_hash (VARCHAR)
- role (ENUM: user, admin, moderator)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)
```

### User Profiles Table
```sql
- user_id (UUID, Foreign Key)
- address (TEXT)
- preferences (JSONB)
- interests (TEXT[])
```

### User Statistics Table
```sql
- user_id (UUID, Foreign Key)
- total_orders (INTEGER)
- total_spent (DECIMAL)
- loyalty_points (INTEGER)
```

## 🛠 Database Operations

### **Backup & Recovery**
- Automated backup creation
- Point-in-time recovery
- Backup verification
- Restore functionality

### **Data Import/Export**
- CSV import with validation
- Bulk user creation
- Data export in multiple formats
- Error handling and reporting

### **Performance Monitoring**
- Query performance tracking
- Connection monitoring
- Storage usage analytics
- Capacity planning

## 🔧 Configuration

### Environment Variables
```env
# SQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gearupsports
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
DB_MAX_CONNECTIONS=20

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gearupsports

# Application
NODE_ENV=production
```

### Database Switching
The application supports switching between database types:
1. **Local Storage** - No setup required
2. **SQL Database** - Requires PostgreSQL/MySQL setup
3. **MongoDB** - Requires MongoDB installation

## 📈 Scalability

### **Capacity Planning**
- **Current Limit**: 1,000 users
- **Storage Monitoring**: Real-time usage tracking
- **Performance Metrics**: Response time monitoring
- **Auto-scaling**: Configurable capacity limits

### **Optimization Features**
- Database indexing for fast queries
- Connection pooling for efficiency
- Query optimization for large datasets
- Automatic cleanup of old data

## 🔐 Security

### **Data Protection**
- Encrypted password storage
- Secure session management
- SQL injection prevention
- XSS protection
- CSRF protection

### **Access Control**
- Role-based permissions
- User activity auditing
- Failed login tracking
- Account lockout protection

## 📱 Admin Features

### **Database Control Panel**
- Real-time database status
- Connection management
- Performance monitoring
- Backup/restore operations
- User management interface

### **Analytics Dashboard**
- User growth metrics
- Revenue analytics
- System health monitoring
- Capacity utilization

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure database** (optional - defaults to localStorage)
4. **Start development server**: `npm run dev`
5. **Access admin panel**: Profile → Database Control

## 🔄 Migration Guide

### From localStorage to SQL/MongoDB
1. Export existing data via admin panel
2. Set up new database
3. Switch database type in control panel
4. Import data to new database

## 📊 Monitoring & Maintenance

### **Health Checks**
- Database connectivity
- Query performance
- Storage capacity
- User activity

### **Maintenance Tasks**
- Regular backups
- Database optimization
- Index maintenance
- Log cleanup

## 🛡 Backup Strategy

### **Automated Backups**
- Every 5 minutes during active use
- Retention: 30 days
- Verification: Automatic integrity checks
- Recovery: Point-in-time restore

### **Manual Backups**
- On-demand backup creation
- Custom retention periods
- Export to external storage
- Backup validation

This database management system provides enterprise-grade capabilities for managing 500+ users with professional features for scalability, security, and performance.
