const dns = require('dns');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Force Node.js à utiliser un serveur DNS public
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://nattydbuser:GJ4i1YeG1iKbzCbZ@natty.1vsjt0f.mongodb.net/?appName=Natty";

async function run() {
  try {
    console.log('Test de résolution DNS avec Google DNS...');
    const addresses = await dns.promises.resolve4('natty.1vsjt0f.mongodb.net');
    console.log('✅ DNS résolu vers:', addresses);

    console.log('\nConnexion à MongoDB...');
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
  }
}

run();
