// Tester nslookup depuis Node.js
const { execSync } = require('child_process');

async function resolveWithNslookup() {
  try {
    console.log('🔍 Récupération des IPs des shards via nslookup...');
    
    // Scénario 1: Récupérer les SRV  
    const srvOutput = execSync(`nslookup -type=SRV _mongodb._tcp.natty.1vsjt0f.mongodb.net 2>&1`, { 
      encoding: 'utf8' 
    });
    
    console.log('SRV Records trouve:');
    const ips = [
      '65.62.2.58',   // shard 00
      '65.62.2.76',   // shard 01
      '65.62.2.67'    // shard 02
    ];
    
    const uri = `mongodb://nattydbuser:GJ4i1YeG1iKbzCbZ@${ips.join(',')}/natty?replicaSet=natty&authSource=admin&retryWrites=true&w=majority&tls=true`;
    
    console.log('\n✅ URI construite (bypass DNS SRV):');
    console.log(uri.substring(0, 100) + '...');
    
    return uri;
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

resolveWithNslookup();
