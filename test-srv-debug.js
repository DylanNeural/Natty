const dns = require('dns').promises;
const { MongoClient } = require('mongodb');

async function testSRV() {
  try {
    console.log('🔍 Test SRV resolution...');
    
    // Tester la résolution DNS SRV
    try {
      const srvRecords = await dns.resolveSrv('_mongodb._tcp.natty.1vsjt0f.mongodb.net');
      console.log('✅ SRV records found:', srvRecords);
    } catch (e) {
      console.log('⚠️ SRV resolution failed:', e.message);
    }

    // Tester la résolution A record
    try {
      const addresses = await dns.resolve4('natty.1vsjt0f.mongodb.net');
      console.log('✅ A records (IPs):', addresses);
    } catch (e) {
      console.log('❌ A record resolution failed:', e.message);
    }

    console.log('\n🔄 Testing direct IP connection...');
    
    // Test avec IPs directes SANS TLS
    const uriNoTLS = "mongodb://nattydbuser:GJ4i1YeG1iKbzCbZ@65.62.2.58:27017,65.62.2.76:27017,65.62.2.67:27017/natty?replicaSet=natty&retryWrites=true&w=majority&authSource=admin";
    
    const client1 = new MongoClient(uriNoTLS, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000
    });

    console.log('Tentative sans TLS sur IPs directes...');
    await client1.connect();
    const result = await client1.db("admin").command({ ping: 1 });
    console.log('✅ SUCCESS sans TLS:', result);
    await client1.close();
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
  }
}

testSRV();
