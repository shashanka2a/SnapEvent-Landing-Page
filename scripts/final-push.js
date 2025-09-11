#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Final Supabase Schema Push Attempt');
console.log('=====================================');

// Try different connection string formats
const connectionStrings = [
  // Format 1: Standard pooler
  "postgresql://postgres.sfgudtyliwnictmjsjwt:hTSLyqBTmJfa3ht0@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require",
  
  // Format 2: With connection pooling disabled
  "postgresql://postgres.sfgudtyliwnictmjsjwt:hTSLyqBTmJfa3ht0@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=false",
  
  // Format 3: With connection timeout
  "postgresql://postgres.sfgudtyliwnictmjsjwt:hTSLyqBTmJfa3ht0@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&connect_timeout=60",
  
  // Format 4: With application name
  "postgresql://postgres.sfgudtyliwnictmjsjwt:hTSLyqBTmJfa3ht0@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&application_name=prisma"
];

for (let i = 0; i < connectionStrings.length; i++) {
  const connectionString = connectionStrings[i];
  console.log(`\n🔄 Attempt ${i + 1}/4: Testing connection string format ${i + 1}`);
  console.log('   Connection:', connectionString.replace(/:[^:@]+@/, ':***@'));
  
  process.env.DATABASE_URL = connectionString;
  
  try {
    console.log('   🔄 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('   ✅ Prisma client generated');
    
    console.log('   📤 Attempting schema push...');
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      timeout: 120000 // 2 minutes per attempt
    });
    
    console.log('\n🎉 SUCCESS! Schema pushed successfully!');
    console.log('📊 You can view your database at:');
    console.log('   https://supabase.com/dashboard/project/sfgudtyliwnictmjsjwt/editor');
    process.exit(0);
    
  } catch (error) {
    console.log(`   ❌ Attempt ${i + 1} failed: ${error.message}`);
    if (i === connectionStrings.length - 1) {
      console.log('\n❌ All connection string formats failed');
      console.log('\n💡 Alternative solutions:');
      console.log('1. Create tables manually in Supabase Dashboard');
      console.log('2. Use Supabase CLI: npx supabase gen types typescript');
      console.log('3. Check if your Supabase project is paused');
      console.log('4. Try connecting from a different network');
      process.exit(1);
    }
  }
}


