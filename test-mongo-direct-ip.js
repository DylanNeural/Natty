const { MongoClient, ServerApiVersion } = require('mongodb');

// Connexion directe à l'IP du shard (bypass SRV lookup)
// URI format: mongodb://username:password@host:port/database
const uri = "mongodb://nattydbuser:GJ4i1YeG1iKbzCbZ@65.62.2.58:27017/natty?retryWrites=true&w=majority&authSource=admin";

async function run() {
  try {
    console.log('📡 Tentative de connexion directe à MongoDB...');
    console.log('Serveur:', '65.62.2.58:27017');
    
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connecté à MongoDB avec succès!");
    await client.close();
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    console.error("Code:", err.code);
  }
}

run();
