# 🚀 Supabase Connection Guide for SnapEvent

Based on experience implementing blockchain dating apps, here are 5 precise, powerful instructions for connecting to Supabase:

## **5-Step Supabase Connection Guide**

### **1. Create Supabase Project & Get Credentials**
```bash
# Go to https://supabase.com/dashboard
# Create new project → Choose region → Set password
# Copy these 4 values:
# - Project URL: https://[PROJECT_REF].supabase.co
# - Database URL: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
# - Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# - Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Your Current Project Details:**
- **Project ID**: `chkbamuurntcmhgraxrh`
- **Project URL**: `https://chkbamuurntcmhgraxrh.supabase.co`
- **Database URL**: `postgresql://postgres.chkbamuurntcmhgraxrh:aJ7l0X1WG5VfMFRo@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require`

### **2. Configure Environment Variables**
```env
# .env.local
DATABASE_URL=postgresql://postgres.chkbamuurntcmhgraxrh:aJ7l0X1WG5VfMFRo@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://chkbamuurntcmhgraxrh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

**⚠️ Important**: 
- Always use `NEXT_PUBLIC_` prefix for client-side Supabase variables
- Keep service role key server-side only for admin operations
- Never commit `.env` files to version control

### **3. Install & Configure Prisma**
```bash
# Already installed in your project
npm install prisma @prisma/client @supabase/supabase-js

# Your Prisma schema is already configured with:
# - provider = "postgresql" 
# - url = env("DATABASE_URL")
# - Comprehensive SnapEvent database schema
```

### **4. Push Schema & Generate Client**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase (creates tables)
npm run db:push

# Seed with demo data
npm run db:seed

# Open Prisma Studio to view your database
npm run db:studio
```

### **5. Test Connection & Enable RLS**
```bash
# Test database connection
node scripts/test-db-connection.js

# Push database schema
node scripts/push-database.js

# In Supabase Dashboard → Authentication → Policies
# Enable Row Level Security (RLS) on all tables
# Create policies for authenticated users
```

## **🔧 Supabase Client Configuration**

### **Client-Side Usage** (`src/lib/supabase.ts`)
```typescript
import { supabase, supabaseHelpers } from '@/lib/supabase'

// Get current user
const user = await supabaseHelpers.getCurrentUser()

// Sign up new user
const { data } = await supabaseHelpers.signUp(email, password, { firstName, lastName })

// Sign in user
const { data } = await supabaseHelpers.signIn(email, password)

// Get photographer profile
const profile = await supabaseHelpers.getPhotographerProfile(userId)
```

### **Server-Side Usage** (`src/lib/supabase-server.ts`)
```typescript
import { createServerClient, createAdminClient, serverSupabaseHelpers } from '@/lib/supabase-server'

// In API routes
const supabase = createServerClient()
const user = await serverSupabaseHelpers.getUser()

// Admin operations
const adminSupabase = createAdminClient()
const allUsers = await serverSupabaseHelpers.adminGetAllUsers()
```

## **🛡️ Row Level Security (RLS) Setup**

### **Enable RLS on All Tables**
```sql
-- In Supabase SQL Editor
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE photographer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### **Create RLS Policies**
```sql
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Photographers can manage their own profiles
CREATE POLICY "Photographers can manage own profile" ON photographer_profiles
  FOR ALL USING (auth.uid()::text = user_id);

-- Public can read approved photographer profiles
CREATE POLICY "Public can view approved photographers" ON photographer_profiles
  FOR SELECT USING (application_status = 'APPROVED');
```

## **📊 Database Schema Overview**

Your SnapEvent database includes:

### **Core Tables**
- **users**: User accounts and authentication
- **photographer_profiles**: Photographer information and portfolios
- **services**: Photography services offered
- **bookings**: Client bookings and appointments
- **reviews**: Client reviews and ratings
- **messages**: Communication between users

### **Supporting Tables**
- **specialties**: Photography specialties (wedding, portrait, etc.)
- **portfolio_items**: Photographer portfolio images
- **awards**: Professional awards and certifications
- **testimonials**: Client testimonials
- **availability**: Photographer availability calendar
- **payments**: Payment tracking
- **notifications**: System notifications
- **analytics**: Usage analytics

## **🚀 Quick Commands Reference**

```bash
# Setup
npm install prisma @prisma/client @supabase/supabase-js
npx prisma init

# Development
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed with sample data
npm run db:studio      # Open Prisma Studio

# Testing
node scripts/test-db-connection.js    # Test connection
node scripts/push-database.js         # Full database setup

# Production
npx prisma migrate deploy    # Deploy migrations
npx prisma generate          # Generate client
```

## **🔍 Troubleshooting**

### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Connection refused | Check if DATABASE_URL is correct and project is active |
| RLS blocking queries | Enable RLS policies or use service role key for admin operations |
| Prisma client not found | Run `npm run db:generate` after schema changes |
| Environment variables not loading | Restart dev server after adding new env vars |
| Migration conflicts | Use `npm run db:push` for development, migrations for production |

### **Connection Testing**
```bash
# Test all connection methods
node scripts/test-db-connection.js

# This will test:
# 1. Direct connection with SSL required
# 2. Direct connection with SSL preferred  
# 3. Pooler connection with SSL
# 4. Direct connection without SSL (for testing)
```

## **🔐 Security Best Practices**

1. **Environment Variables**
   - Use `NEXT_PUBLIC_` prefix only for client-side variables
   - Keep service role key server-side only
   - Never commit `.env` files to version control

2. **Row Level Security**
   - Enable RLS on all tables in production
   - Create appropriate policies for data access
   - Test policies thoroughly

3. **Connection Security**
   - Use SSL connections (`sslmode=require`)
   - Use connection pooling for production
   - Rotate database passwords regularly

## **📞 Support & Next Steps**

### **Current Status**: ✅ Supabase connection configured
### **Next Steps**:
1. **Get your API keys** from Supabase dashboard
2. **Update .env file** with your actual keys
3. **Test connection** with `node scripts/test-db-connection.js`
4. **Push schema** with `node scripts/push-database.js`
5. **Enable RLS** in Supabase dashboard
6. **Start building** your SnapEvent features!

### **Useful Links**:
- [Supabase Dashboard](https://supabase.com/dashboard/project/chkbamuurntcmhgraxrh)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**🎉 Your Supabase connection is ready!** Follow the steps above to complete the setup and start building your SnapEvent platform.




