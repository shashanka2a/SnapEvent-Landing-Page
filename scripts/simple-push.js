#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Simple Supabase Schema Push');
console.log('==============================');

// Set the working database URL
const DATABASE_URL = "postgresql://postgres.sfgudtyliwnictmjsjwt:hTSLyqBTmJfa3ht0@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require";
process.env.DATABASE_URL = DATABASE_URL;

console.log('✅ Using database:', DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

try {
  console.log('\n🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  console.log('\n📤 Pushing schema to Supabase...');
  execSync('npx prisma db push', { 
    stdio: 'inherit',
    timeout: 300000 // 5 minutes
  });
  
  console.log('\n🎉 Schema pushed successfully!');
  console.log('\n📊 You can view your database at:');
  console.log('   https://supabase.com/dashboard/project/sfgudtyliwnictmjsjwt/editor');
  
} catch (error) {
  console.error('\n❌ Push failed:', error.message);
  process.exit(1);
}


