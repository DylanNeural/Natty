/**
 * backend/config/env-validator.js
 *
 * Valide les variables d'environnement au démarrage
 * Utilisation: require('./backend/config/env-validator');
 */

const fs = require('fs');
const path = require('path');

// Variables requises par environnement
const REQUIRED_VARS = {
  all: ['NODE_ENV', 'PORT', 'HOST', 'SERVER_URL'],
  development: ['MONGODB_URI', 'JWT_SECRET'],
  production: ['MONGODB_URI', 'JWT_SECRET', 'RECAPTCHA_SECRET_KEY'],
};

// Variables optionnelles
const OPTIONAL_VARS = [
  'OPENAI_API_KEY',
  'RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'CORS_ORIGINS',
  'LOG_LEVEL',
  'LOG_FILE',
];

/**
 * Valide la présence et le format des variables d'environnement
 */
function validateEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const requiredVars = [...REQUIRED_VARS.all, ...(REQUIRED_VARS[nodeEnv] || [])];

  console.log('\n🔍 Validation des variables d\'environnement...\n');
  console.log(`📌 Mode: ${nodeEnv}`);

  let hasErrors = false;
  const missingVars = [];
  const emptyVars = [];
  const validVars = [];

  // Vérifier les variables requises
  requiredVars.forEach(varName => {
    const value = process.env[varName];

    if (!value) {
      missingVars.push(varName);
      console.log(`❌ ${varName} - MANQUANTE`);
      hasErrors = true;
    } else if (value.includes('your-') || value.includes('change-in-production')) {
      emptyVars.push(varName);
      console.log(`⚠️  ${varName} - Non configurée (valeur par défaut)`);
      hasErrors = true;
    } else {
      validVars.push(varName);
      console.log(`✅ ${varName}`);
    }
  });

  // Vérifier les variables optionnelles
  console.log('\n📦 Variables optionnelles:');
  OPTIONAL_VARS.forEach(varName => {
    const value = process.env[varName];

    if (value) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`⏭️  ${varName} (non définie)`);
    }
  });

  // Afficher le résumé
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Valides: ${validVars.length}`);
  console.log(`⚠️  Non configurées: ${emptyVars.length}`);
  console.log(`❌ Manquantes: ${missingVars.length}`);
  console.log('='.repeat(50) + '\n');

  // Validations supplémentaires
  if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
    console.log('❌ PORT doit être un nombre');
    hasErrors = true;
  }

  if (process.env.SERVER_URL && !isValidUrl(process.env.SERVER_URL)) {
    console.log('❌ SERVER_URL doit être une URL valide');
    hasErrors = true;
  }

  if (process.env.MONGODB_URI && !isValidMongoUri(process.env.MONGODB_URI)) {
    console.log('⚠️  MONGODB_URI semble invalide');
  }

  if (process.env.CORS_ORIGINS) {
    const origins = process.env.CORS_ORIGINS.split(',').map(o => o.trim());
    origins.forEach(origin => {
      if (!isValidUrl(origin)) {
        console.log(`❌ CORS_ORIGINS - "${origin}" n'est pas une URL valide`);
        hasErrors = true;
      }
    });
  }

  // En production, certaines variables ne doivent pas être les defaults
  if (nodeEnv === 'production') {
    if (process.env.JWT_SECRET === 'dev-secret-natty-change-in-production') {
      console.log('❌ JWT_SECRET ne doit pas utiliser la clé par défaut en production!');
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.log('⛔ Erreurs de configuration détectées!');
    console.log('📖 Consultez .env.example pour les valeurs attendues.\n');

    if (nodeEnv === 'production') {
      console.log('🛑 Démarrage du serveur arrêté en mode production avec erreurs.');
      process.exit(1);
    } else {
      console.log('⚠️  Attention: Le serveur démarrera mais peut présenter des problèmes.\n');
    }
  } else {
    console.log('✅ Toutes les variables d\'environnement sont correctement configurées!\n');
  }
}

/**
 * Valide une URL
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Valide une URI MongoDB
 */
function isValidMongoUri(uri) {
  return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
}

/**
 * Affiche un résumé des configs importantes
 */
function printConfigSummary() {
  console.log('\n📋 Résumé de la configuration:');
  console.log('================================');
  console.log(`🌐 Server: ${process.env.SERVER_URL || 'http://localhost:' + (process.env.PORT || 5000)}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? '✅ Configurée' : '❌ Non configurée'}`);
  console.log(`🔐 JWT: ${process.env.JWT_SECRET ? '✅ Configurée' : '❌ Non configurée'}`);
  console.log(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? '✅ Configurée' : '⏭️  Non configurée'}`);
  console.log(`🔀 CORS Origins: ${process.env.CORS_ORIGINS || '(par défaut)'}`);
  console.log('================================\n');
}

// Exporter et exécuter
if (require.main === module) {
  validateEnv();
  printConfigSummary();
} else {
  validateEnv();
}

module.exports = { validateEnv, printConfigSummary };
