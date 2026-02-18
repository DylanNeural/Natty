const { MongoClient } = require('mongodb');

// URI de réplica set SANS SRV lookup (bypass DNS complètement)
// Connecte directement aux 3 shards avec leurs IPs
const uri = "mongodb://nattydbuser:GJ4i1YeG1iKbzCbZ@65.62.2.58:27017,65.62.2.76:27017,65.62.2.67:27017/natty?replicaSet=natty&retryWrites=true&w=majority&authSource=admin&tls=true&tlsAllowInvalidCertificates=true&tlsAllowInvalidHostnames=true";

async function run() {
  try {
    console.log('📡 Connexion MongoDB directe aux IPs (bypass DNS/SRV)...');
    console.log('Shards: 65.62.2.58, 65.62.2.76, 65.62.2.67:27017');
    
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000
    });

    await client.connect();
    console.log('✅ Connecté!');
    
    const adminDb = client.db("admin");
    const result = await adminDb.command({ ping: 1 });
    console.log("✅ Ping réussi:", result);
    
    await client.close();
    console.log('✅ Connexion fermée - SUCCESS!');
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    if (err.cause) console.error("Cause:", err.cause.message);
  }
}

run();
