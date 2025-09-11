# Supabase Database Setup Guide

## 🔗 **Database Connection Details**

Your Supabase project details:
- **Project ID**: `chkbamuurntcmhgraxrh`
- **Password**: `aJ7l0X1WG5VfMFRo`

## 📋 **Connection String Options**

### **Option 1: Direct Connection (Recommended)**
```bash
DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=require"
```

### **Option 2: Pooler Connection (For High Traffic)**
```bash
DATABASE_URL="postgresql://postgres.chkbamuurntcmhgraxrh:aJ7l0X1WG5VfMFRo@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"
```

### **Option 3: Connection with Timeout**
```bash
DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=require&connect_timeout=60"
```

## 🛠️ **Setup Steps**

### **1. Create .env File**
```bash
cp env.example .env
```

### **2. Update .env with Connection String**
Choose one of the connection strings above and add it to your `.env` file:

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=require"

# Other environment variables...
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### **3. Test Database Connection**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or create migration
npm run db:migrate
```

### **4. Seed Database (Optional)**
```bash
npm run db:seed
```

## 🔧 **Troubleshooting**

### **Connection Issues**

If you get `P1001: Can't reach database server`:

1. **Check Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to Settings → Database
   - Verify the connection string format

2. **Try Different SSL Modes**:
   ```bash
   # Try without SSL first
   DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=disable"
   
   # Then with prefer
   DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=prefer"
   
   # Finally with require
   DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=require"
   ```

3. **Check Network/Firewall**:
   - Ensure your network allows outbound connections to port 5432
   - Check if your ISP blocks database connections

4. **Verify Credentials**:
   - Double-check the password in Supabase dashboard
   - Ensure the project ID is correct

### **Alternative Connection Methods**

#### **Using Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref chkbamuurntcmhgraxrh

# Generate types
supabase gen types typescript --linked > types/supabase.ts
```

#### **Using Connection Pooling**
For production applications, consider using connection pooling:

```bash
# With PgBouncer (Supabase default)
DATABASE_URL="postgresql://postgres.chkbamuurntcmhgraxrh:aJ7l0X1WG5VfMFRo@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"
```

## 📊 **Database Schema**

Your SnapEvent database includes:

- **Users**: User accounts and authentication
- **PhotographerProfiles**: Photographer information and portfolios
- **Services**: Photography services offered
- **Bookings**: Client bookings and appointments
- **Reviews**: Client reviews and ratings
- **Notifications**: System notifications
- **Messages**: Communication between users

## 🚀 **Next Steps**

1. **Test Connection**: Run `npm run db:push` to create tables
2. **Seed Data**: Run `npm run db:seed` to add sample data
3. **View Database**: Use `npm run db:studio` to open Prisma Studio
4. **Deploy**: Update production environment variables

## 🔐 **Security Notes**

- **Never commit `.env` files** to version control
- **Use environment variables** in production
- **Rotate database passwords** regularly
- **Enable Row Level Security (RLS)** in Supabase dashboard
- **Use connection pooling** for production applications

## 📞 **Support**

If you continue having connection issues:

1. Check Supabase status page
2. Verify your project is active
3. Contact Supabase support
4. Check your network configuration

---

**Current Status**: ⚠️ Connection testing in progress
**Recommended Action**: Try the direct connection string first, then pooler if needed

