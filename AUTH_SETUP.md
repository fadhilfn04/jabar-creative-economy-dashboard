# Authentication Setup Guide

This guide will help you set up authentication for your PostgreSQL database.

## 📋 Overview

The application uses NextAuth.js with credentials provider for authentication. Users are stored in PostgreSQL with bcrypt password hashing.

## 🚀 Quick Setup

### 1. Database Configuration

Your database is already configured in `.env.local`:
- Database: `ekonomi_kreatif_jabar`
- Host: `194.233.89.37`
- User: `erlan`

### 2. Run Database Migration

Create the users table and setup authentication:

```bash
./scripts/migrate.sh
```

This will:
- Create the `users` table
- Set up indexes and triggers
- Create a default admin user

⚠️ **Important**: The default admin password should be changed immediately!

### 3. Test Connection

Verify your database connection works:

```bash
node scripts/test-db-connection.js
```

## 🔐 Default Admin Account

After migration, a default admin account is created:

- **Email**: `admin@ekraf.jabarprov.go.id`
- **Password**: `admin123`

**Change this password immediately!**

## 🛠️ Password Management

### Generate New Password Hash

To generate a secure password hash:

```bash
node scripts/generate-password-hash.js "your_new_password"
```

### Update Admin Password

Connect to your database and run:

```sql
UPDATE users 
SET password_hash = '$2b$10$YourNewHashedPasswordHere' 
WHERE email = 'admin@ekraf.jabarprov.go.id';
```

## 📁 Authentication Files

- **`lib/auth-config.ts`** - NextAuth configuration
- **lib/user-service.ts`** - User CRUD operations
- **lib/database-connection.ts`** - Database connection pool
- **`app/api/auth/[...nextauth]/route.ts`** - NextAuth API routes
- **`app/api/auth/register/route.ts`** - User registration endpoint
- **`hooks/use-postgres-auth.tsx`** - Client-side authentication hook

## 🔑 API Endpoints

### Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

### Sign In
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Sign Out
```
POST /api/auth/signout
```

## 🎨 Usage in Components

```tsx
import { usePostgresAuth } from '@/hooks/use-postgres-auth'

function MyComponent() {
  const { user, isAuthenticated, isLoading } = usePostgresAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return <div>Welcome, {user.name}!</div>
}
```

## 🔒 Security Notes

1. **Passwords** are hashed using bcrypt (10 rounds)
2. **Session tokens** expire after 30 days
3. **NextAuth secret** should be generated with `openssl rand -hex 32`
4. **Database credentials** should never be committed to git

## 🐛 Troubleshooting

### Connection Issues
- Check if PostgreSQL server is running
- Verify `.env.local` credentials
- Ensure database exists: `psql -h host -U user -l`

### Authentication Issues
- Clear browser cookies and localStorage
- Check NextAuth logs in console
- Verify users table has data

### Migration Issues
- Ensure psql client is installed
- Check database permissions
- Run migration manually if needed

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)