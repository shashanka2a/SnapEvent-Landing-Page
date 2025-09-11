#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Connection configurations to try
const connectionConfigs = [
  {
    name: 'Direct Connection with SSL Required',
    config: {
      host: 'db.chkbamuurntcmhgraxrh.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'aJ7l0X1WG5VfMFRo',
      ssl: {
        rejectUnauthorized: false,
        require: true
      },
      connectionTimeoutMillis: 10000,
      query_timeout: 10000
    }
  },
  {
    name: 'Direct Connection with SSL Preferred',
    config: {
      host: 'db.chkbamuurntcmhgraxrh.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'aJ7l0X1WG5VfMFRo',
      ssl: {
        rejectUnauthorized: false,
        require: false
      },
      connectionTimeoutMillis: 10000,
      query_timeout: 10000
    }
  },
  {
    name: 'Pooler Connection with SSL',
    config: {
      host: 'aws-1-us-east-2.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.chkbamuurntcmhgraxrh',
      password: 'aJ7l0X1WG5VfMFRo',
      ssl: {
        rejectUnauthorized: false,
        require: true
      },
      connectionTimeoutMillis: 10000,
      query_timeout: 10000
    }
  },
  {
    name: 'Direct Connection without SSL (for testing)',
    config: {
      host: 'db.chkbamuurntcmhgraxrh.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'aJ7l0X1WG5VfMFRo',
      ssl: false,
      connectionTimeoutMillis: 10000,
      query_timeout: 10000
    }
  }
];

async function testConnection(config) {
  const client = new Client(config.config);
  
  try {
    console.log(`\n🔍 Testing: ${config.name}`);
    console.log(`   Host: ${config.config.host}:${config.config.port}`);
    console.log(`   Database: ${config.config.database}`);
    console.log(`   User: ${config.config.user}`);
    console.log(`   SSL: ${config.config.ssl ? JSON.stringify(config.config.ssl) : 'false'}`);
    
    // Connect to database
    await client.connect();
    console.log('   ✅ Connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('   ✅ Query successful!');
    console.log(`   📊 PostgreSQL Version: ${result.rows[0].version.split(' ')[0]}`);
    console.log(`   📊 Database: ${result.rows[0].current_database}`);
    console.log(`   📊 User: ${result.rows[0].current_user}`);
    
    // Test if we can create a table (to verify permissions)
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS connection_test (
          id SERIAL PRIMARY KEY,
          test_message TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('   ✅ Table creation successful!');
      
      // Insert test data
      await client.query(`
        INSERT INTO connection_test (test_message) 
        VALUES ('Connection test successful at ' || NOW())
      `);
      console.log('   ✅ Data insertion successful!');
      
      // Query test data
      const testResult = await client.query('SELECT * FROM connection_test ORDER BY created_at DESC LIMIT 1');
      console.log(`   ✅ Data query successful! Latest test: ${testResult.rows[0].test_message}`);
      
      // Clean up test table
      await client.query('DROP TABLE IF EXISTS connection_test');
      console.log('   ✅ Cleanup successful!');
      
    } catch (tableError) {
      console.log(`   ⚠️  Table operations failed: ${tableError.message}`);
    }
    
    await client.end();
    return { success: true, config: config.name };
    
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    console.log(`   🔍 Error code: ${error.code || 'N/A'}`);
    console.log(`   🔍 Error detail: ${error.detail || 'N/A'}`);
    
    try {
      await client.end();
    } catch (endError) {
      // Ignore end errors
    }
    
    return { success: false, config: config.name, error: error.message };
  }
}

async function generateConnectionString(workingConfig) {
  const config = workingConfig.config;
  
  let connectionString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
  
  // Add SSL parameters
  const sslParams = [];
  if (config.ssl) {
    if (config.ssl.require) {
      sslParams.push('sslmode=require');
    } else {
      sslParams.push('sslmode=prefer');
    }
    if (config.ssl.rejectUnauthorized === false) {
      sslParams.push('sslcert=');
      sslParams.push('sslkey=');
      sslParams.push('sslrootcert=');
    }
  } else {
    sslParams.push('sslmode=disable');
  }
  
  if (sslParams.length > 0) {
    connectionString += '?' + sslParams.join('&');
  }
  
  return connectionString;
}

async function main() {
  console.log('🚀 Supabase Database Connection Tester');
  console.log('=====================================');
  
  const results = [];
  
  // Test each connection configuration
  for (const config of connectionConfigs) {
    const result = await testConnection(config);
    results.push(result);
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📋 Connection Test Summary');
  console.log('==========================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful connections: ${successful.length}`);
  console.log(`❌ Failed connections: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎉 Working Connection Found!');
    console.log('============================');
    
    const workingConfig = connectionConfigs.find(config => 
      results.find(r => r.config === config.name && r.success)
    );
    
    if (workingConfig) {
      const connectionString = await generateConnectionString(workingConfig);
      console.log(`\n📝 Recommended DATABASE_URL:`);
      console.log(`DATABASE_URL="${connectionString}"`);
      
      // Update .env file
      try {
        const envPath = path.join(__dirname, '..', '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Replace DATABASE_URL line
        envContent = envContent.replace(
          /DATABASE_URL=.*/,
          `DATABASE_URL="${connectionString}"`
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log('\n✅ Updated .env file with working connection string!');
        
      } catch (envError) {
        console.log(`\n⚠️  Could not update .env file: ${envError.message}`);
        console.log('Please manually update your .env file with the connection string above.');
      }
    }
  } else {
    console.log('\n❌ No working connections found.');
    console.log('\n🔧 Troubleshooting suggestions:');
    console.log('1. Check if your Supabase project is active');
    console.log('2. Verify the password is correct');
    console.log('3. Check your network/firewall settings');
    console.log('4. Try connecting from Supabase dashboard');
    console.log('5. Contact Supabase support if issues persist');
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Connection Details:');
    failed.forEach(f => {
      console.log(`   • ${f.config}: ${f.error}`);
    });
  }
  
  console.log('\n🏁 Connection test completed!');
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the test
main().catch(console.error);

