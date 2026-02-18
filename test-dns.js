const dns = require('dns').promises;

async function testDns() {
  try {
    console.log('Test 1: Résolution simple...');
    const simple = await dns.resolve4('natty.1vsjt0f.mongodb.net');
    console.log('✅ Simple résolution:', simple);
  } catch (err) {
    console.log('❌ Simple résolution échouée:', err.message);
  }

  try {
    console.log('\nTest 2: Résolution SRV...');
    const srv = await dns.resolveSrv('_mongodb._tcp.natty.1vsjt0f.mongodb.net');
    console.log('✅ SRV résolution:', srv);
  } catch (err) {
    console.log('❌ SRV résolution échouée:', err.message);
  }

  try {
    console.log('\nTest 3: Résolution du shard...');
    const shard = await dns.resolve4('ac-m6eckp8-shard-00-00.1vsjt0f.mongodb.net');
    console.log('✅ Shard résolution:', shard);
  } catch (err) {
    console.log('❌ Shard résolution échouée:', err.message);
  }
}

testDns().catch(console.error);
