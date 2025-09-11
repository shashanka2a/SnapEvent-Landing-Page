#!/usr/bin/env node

const { Client } = require('pg');

async function testConnection() {
  console.log('🔍 Testing Supabase Connection');
  console.log('==============================');

  const configs = [
    {
      name: 'Pooler Connection',
      config: {
        host: 'aws-1-us-east-2.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.sfgudtyliwnictmjsjwt',
        password: 'hTSLyqBTmJfa3ht0',
        ssl: { rejectUnauthorized: false, require: true },
        connectionTimeoutMillis: 10000
      }
    },
    {
      name: 'Direct Connection (if available)',
      config: {
        host: 'db.sfgudtyliwnictmjsjwt.supabase.co',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'hTSLyqBTmJfa3ht0',
        ssl: { rejectUnauthorized: false, require: true },
        connectionTimeoutMillis: 10000
      }
    }
  ];

  for (const { name, config } of configs) {
    console.log(`\n🔍 Testing: ${name}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   User: ${config.user}`);
    
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log('   ✅ Connection successful!');
      
      const result = await client.query('SELECT version(), current_database(), current_user');
      console.log(`   📊 Database: ${result.rows[0].current_database}`);
      console.log(`   📊 User: ${result.rows[0].current_user}`);
      
      await client.end();
      console.log('   🔌 Connection closed');
      
      // If we get here, this connection works
      console.log(`\n🎉 Working connection found: ${name}`);
      return config;
      
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
      try {
        await client.end();
      } catch (e) {
        // Ignore
      }
    }
  }
  
  console.log('\n❌ No working connections found');
  return null;
}

// Run the test only if this script is executed directly
if (require.main === module) {
  testConnection().catch(console.error);
}

// Export for testing
module.exports = { testConnection };

