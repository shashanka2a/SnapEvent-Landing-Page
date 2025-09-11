#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database for SnapEvent...\n');

  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('Creating .env file from env.example...');
    try {
      fs.copyFileSync(path.join(process.cwd(), 'env.example'), envPath);
      console.log('✅ Created .env file from env.example');
    } catch (error) {
      console.error('❌ Failed to create .env file:', error.message);
      process.exit(1);
    }
  }

  // Read current .env file
  const envContent = fs.readFileSync(envPath, 'utf8');

  // Check if NEXT_PUBLIC_SUPABASE_URL exists
  const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);
  if (!supabaseUrlMatch) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env file!');
    console.log('Please add your Supabase URL to the .env file first.');
    process.exit(1);
  }

  const supabaseUrl = supabaseUrlMatch[1];
  console.log('✅ Found Supabase URL:', supabaseUrl.replace(/\/\/.*@/, '//***@'));

  // Extract project reference from Supabase URL
  const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!projectRefMatch) {
    console.error('❌ Invalid Supabase URL format!');
    process.exit(1);
  }

  const projectRef = projectRefMatch[1];
  console.log('✅ Project reference:', projectRef);
  
  // Update project reference for new database
  const newProjectRef = 'sfgudtyliwnictmjsjwt';
  console.log('✅ Using new project reference:', newProjectRef);

  // Use pooler connection (working) but with connection pooling disabled
  const databaseUrl = `postgresql://postgres.sfgudtyliwnictmjsjwt:hTSLyqBTmJfa3ht0@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`;
  console.log('✅ Using pooler connection with pgbouncer enabled');
  console.log('   Host: aws-1-us-east-2.pooler.supabase.com:6543');
  console.log('   User: postgres.sfgudtyliwnictmjsjwt');
  console.log('   Password: [NEW DB]');
  console.log('   SSL: require with rejectUnauthorized: false');
  console.log('   PgBouncer: enabled');

  console.log('\n📝 Updating .env file...');

  // Update the .env file
  let newEnvContent = envContent;

  // Replace or add DATABASE_URL
  if (newEnvContent.includes('DATABASE_URL=')) {
    newEnvContent = newEnvContent.replace(
      /DATABASE_URL="[^"]*"/,
      `DATABASE_URL="${databaseUrl}"`
    );
  } else {
    newEnvContent = `DATABASE_URL="${databaseUrl}"\n` + newEnvContent;
  }

  fs.writeFileSync(envPath, newEnvContent);
  console.log('✅ Updated DATABASE_URL in .env file');

  console.log('\n🔍 Testing database connection...');
  console.log('   Host: aws-1-us-east-2.pooler.supabase.com:6543');
  console.log('   User: postgres.sfgudtyliwnictmjsjwt');
  console.log('   Connection timeout: 10 seconds');
  console.log('   Query timeout: 10 seconds');
  
  try {
    const { Client } = require('pg');
    const client = new Client({
      host: 'aws-1-us-east-2.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.sfgudtyliwnictmjsjwt',
      password: 'hTSLyqBTmJfa3ht0',
      ssl: {
        rejectUnauthorized: false,
        require: true
      },
      connectionTimeoutMillis: 10000,
      query_timeout: 10000
    });
    
    console.log('   🔗 Attempting to connect...');
    const connectStartTime = Date.now();
    await client.connect();
    const connectDuration = Date.now() - connectStartTime;
    console.log(`   ✅ Connected successfully (took ${connectDuration}ms)`);
    
    console.log('   🔍 Running test query...');
    const queryStartTime = Date.now();
    const result = await client.query('SELECT version(), current_database(), current_user');
    const queryDuration = Date.now() - queryStartTime;
    console.log(`   ✅ Query successful (took ${queryDuration}ms)`);
    
    console.log('✅ Database connection test passed!');
    console.log(`   PostgreSQL Version: ${result.rows[0].version.split(' ')[0]}`);
    console.log(`   Database: ${result.rows[0].current_database}`);
    console.log(`   User: ${result.rows[0].current_user}`);
    
    await client.end();
    console.log('   🔌 Connection closed');
  } catch (error) {
    console.error('❌ Database connection test failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    console.error(`   Detail: ${error.detail || 'N/A'}`);
    process.exit(1);
  }

  console.log('\n🔄 Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client:', error.message);
    process.exit(1);
  }

  console.log('\n📤 Setting up database schema...');
  try {
    // Try migrate first (better for handling prepared statements)
    console.log('🔄 Attempting Prisma migrate (recommended for Supabase)...');
    console.log('   Command: npx prisma migrate dev --name init');
    console.log('   Timeout: 300 seconds (5 minutes)');
    
    let migrateSuccess = false;
    try {
      const migrateStartTime = Date.now();
      execSync('npx prisma migrate dev --name init', { 
        stdio: 'inherit',
        timeout: 300000 // 300 second timeout (5 minutes)
      });
      const migrateDuration = Date.now() - migrateStartTime;
      console.log(`\n🎉 Database schema successfully migrated to Supabase! (took ${migrateDuration}ms)`);
      migrateSuccess = true;
    } catch (migrateError) {
      console.log('⚠️  Migrate failed, trying simple push...');
      console.log('   Error details:', migrateError.message);
      console.log('   Command: npx prisma db push');
      console.log('   Timeout: 300 seconds (5 minutes)');
      
      try {
        const pushStartTime = Date.now();
        execSync('npx prisma db push', { 
          stdio: 'inherit',
          timeout: 300000 // 300 second timeout (5 minutes)
        });
        const pushDuration = Date.now() - pushStartTime;
        console.log(`\n🎉 Database schema successfully pushed to Supabase! (took ${pushDuration}ms)`);
        migrateSuccess = true;
      } catch (pushError) {
        console.log('⚠️  Simple push failed, trying with force reset...');
        console.log('   Error details:', pushError.message);
        console.log('   Command: npx prisma db push --force-reset --accept-data-loss');
        console.log('   Timeout: 300 seconds (5 minutes)');
        
        const forcePushStartTime = Date.now();
        execSync('npx prisma db push --force-reset --accept-data-loss', { 
          stdio: 'inherit',
          timeout: 300000 // 300 second timeout (5 minutes)
        });
        const forcePushDuration = Date.now() - forcePushStartTime;
        console.log(`\n🎉 Database schema successfully pushed to Supabase! (took ${forcePushDuration}ms)`);
        migrateSuccess = true;
      }
    }
    
    if (!migrateSuccess) {
      throw new Error('All schema setup methods failed');
    }
    console.log('\n📊 You can view your database at:');
    console.log(`   https://supabase.com/dashboard/project/${newProjectRef}/editor`);
    console.log('\n🔍 To explore your data with Prisma Studio, run:');
    console.log('   npx prisma studio');
    
    console.log('\n🌱 Seeding database with sample data...');
    try {
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
      console.log('✅ Database seeded successfully');
    } catch (seedError) {
      console.log('⚠️  Database seeding failed (this is optional)');
      console.log(`   Error: ${seedError.message}`);
    }
    
    console.log('\n🎉 SnapEvent database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run `npm run dev` to start the development server');
    console.log('2. Run `npm run db:studio` to open Prisma Studio');
    console.log('3. Check your Supabase dashboard to see the created tables');
    console.log('4. Enable Row Level Security (RLS) in Supabase dashboard');
    
  } catch (error) {
    console.error('❌ Failed to push schema:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your Supabase project is active');
    console.log('2. Verify your network connection');
    console.log('3. Try running the connection test script first');
    console.log('4. Check Supabase status page');
  }
}

// Run the setup only if this script is executed directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

// Export for testing
module.exports = { setupDatabase };