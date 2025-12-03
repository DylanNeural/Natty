const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/projet-natty'; // à adapter si besoin

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB :', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
