const { MongoClient } = require('mongodb');

// URI SANS TLS pour test (juste TCP)
const uri = "mongodb://nattydbuser:GJ4i1YeG1iKbzCbZ@65.62.2.58:27017,65.62.2.76:27017,65.62.2.67:27017/natty?replicaSet=natty&retryWrites=true&w=majority&authSource=admin";

async function run() {
  try {
    console.log('📡 Test: Connexion MongoDB SANS TLS...');
    console.log('URI:', uri.substring(0, 80) + '...');
    
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000
    });

    await client.connect();
    console.log('✅ Connecté à MongoDB!');
    
    const adminDb = client.db("admin");
    const result = await adminDb.command({ ping: 1 });
    console.log("✅ Ping réussi:", result);
    
    // Liste les databases
    const databases = await adminDb.admin().listDatabases();
    console.log("✅ Databases:", databases.databases.map(db => db.name).join(', '));
    
    await client.close();
    console.log('✅ TEST RÉUSSI - Connexion fonctionne!');
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    if (err.cause) console.error("Cause détaillée:", err.cause.message);
  }
}

run();
