const { MongoClient, ServerApiVersion } = require('mongodb');

// Connexion avec TLS/SSL activé (requis pour MongoDB Atlas)
const uri = "mongodb://nattydbuser:GJ4i1YeG1iKbzCbZ@65.62.2.58:27017/natty?retryWrites=true&w=majority&authSource=admin&tls=true";

async function run() {
  try {
    console.log('📡 Tentative de connexion MongoDB avec TLS...');
    console.log('Serveur:', '65.62.2.58:27017');
    
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      tls: true,
      tlsAllowInvalidCertificates: true, // Pour test uniquement
      tlsAllowInvalidHostnames: true      // Pour test uniquement
    });

    await client.connect();
    console.log('✅ Connecté!');
    
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping réussi - Connecté à MongoDB avec succès!");
    
    await client.close();
  } catch (err) {
    console.error("❌ Erreur:", err.message);
  }
}

run();
