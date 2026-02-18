// backend/config/db.js
const mongoose = require("mongoose");
const dns = require("dns");

// Force DNS publique pour contourner les blocages DNS locaux
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// URI principale depuis .env
const MONGODB_URI_ENV = process.env.MONGODB_URI || "";

// URI fallback - MongoDB Atlas SRV officielle
const MONGODB_URI_FALLBACK_STANDARD = "mongodb+srv://nattydbuser:GJ4i1YeG1iKbzCbZ@natty.1vsjt0f.mongodb.net/?appName=Natty";

// URI locale pour développement/dépannage
const MONGODB_URI_LOCAL = "mongodb://127.0.0.1:27017/projet-natty";

async function connectDB() {
  let uriToUse = MONGODB_URI_ENV || MONGODB_URI_FALLBACK_STANDARD;
  
  try {
    console.log("🔄 Tentative de connexion à MongoDB...");
    console.log("   Utilisation URI:", MONGODB_URI_ENV ? "ENV" : "FALLBACK IPs");
    
    await mongoose.connect(uriToUse, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 20000,
      maxPoolSize: 10,
      minPoolSize: 2
    });
    
    console.log("✅ Connecté à MongoDB avec succès!");
    
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    console.error("   Code d'erreur:", error.code);
    
    if (error.reason) {
      console.error("   Détails réseau:", error.reason.type || error.reason);
    }
    
    process.exit(1);
  }
}

module.exports = connectDB;

