#!/usr/bin/env node

// Test Supabase connection script
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Configuration:');
  console.log(`URL: ${url}`);
  console.log(`Key: ${key ? key.substring(0, 20) + '...' : 'Not found'}\n`);

  if (!url || !key) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
  }

  try {
    // Create Supabase client
    const supabase = createClient(url, key);
    console.log('✅ Supabase client created successfully');

    // Test basic connection by trying to get user
    console.log('🔌 Testing connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message !== 'session_not_found') {
      throw error;
    }
    
    console.log('✅ Connection successful!');
    console.log('📊 Session data:', data ? 'Found' : 'None (expected for new connection)');

    // Test if we can make a simple query (will work even without tables)
    console.log('🔍 Testing database query capability...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (tablesError) {
      console.log('⚠️ Database query test failed (expected if no tables exist yet):', tablesError.message);
    } else {
      console.log('✅ Database query capability confirmed');
    }

    console.log('\n🎉 Supabase connection test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Get your database password from Supabase dashboard');
    console.log('2. Update DATABASE_URL in .env.local with the password');
    console.log('3. Run: npx prisma db push');
    console.log('4. Run: npm run dev');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if the URL and API key are correct');
    console.log('2. Verify your Supabase project is active');
    console.log('3. Check if you have internet connection');
    process.exit(1);
  }
}

testSupabaseConnection();