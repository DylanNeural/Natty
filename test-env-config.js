#!/usr/bin/env node

/**
 * Test script pour vérifier la configuration .env
 * Usage: node test-env-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 Test de Configuration Natty\n');
console.log('='.repeat(60));

// 1. Vérifier que .env existe
console.log('\n✓ Étape 1: Vérification du fichier .env');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('  ✅ Fichier .env trouvé');
} else {
  console.log('  ❌ Fichier .env non trouvé!');
  process.exit(1);
}

// 2. Charger les variables
console.log('\n✓ Étape 2: Chargement des variables d\'environnement');
require('dotenv').config();
console.log('  ✅ Variables chargées avec dotenv');

// 3. Vérifier les variables essentielles
console.log('\n✓ Étape 3: Vérification des variables essentielles');
const essentialVars = [
  'NODE_ENV',
  'PORT',
  'HOST',
  'SERVER_URL',
  'MONGODB_URI',
  'JWT_SECRET',
  'CORS_ORIGINS',
];

let allPresent = true;
essentialVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName}`);
  } else {
    console.log(`  ❌ ${varName} - MANQUANTE!`);
    allPresent = false;
  }
});

if (!allPresent) {
  console.log('\n⚠️  Certaines variables essentielles sont manquantes.');
  console.log('   Consultez .env.example pour les valeurs par défaut.\n');
  process.exit(1);
}

// 4. Afficher le résumé
console.log('\n✓ Étape 4: Résumé de la configuration');
console.log(`  📌 Environnement: ${process.env.NODE_ENV}`);
console.log(`  🌐 Serveur: ${process.env.SERVER_URL}`);
console.log(`  🗄️  Base de données: ${process.env.MONGODB_URI.substring(0, 30)}...`);
console.log(`  🔐 JWT configuré: ${process.env.JWT_SECRET ? '✅' : '❌'}`);
console.log(`  🔀 CORS Origins: ${process.env.CORS_ORIGINS.split(',').length} domaines`);

// 5. Vérifications optionnelles
console.log('\n✓ Étape 5: Vérifications optionnelles');
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-')) {
  console.log('  ✅ OpenAI configuré');
} else {
  console.log('  ⏭️  OpenAI non configuré (optionnel)');
}

if (process.env.RECAPTCHA_SECRET_KEY && !process.env.RECAPTCHA_SECRET_KEY.includes('your-')) {
  console.log('  ✅ reCAPTCHA configuré');
} else {
  console.log('  ⏭️  reCAPTCHA non configuré (optionnel)');
}

// 6. Test de connectivité (optionnel)
console.log('\n✓ Étape 6: Avertissements et recommandations');

if (process.env.NODE_ENV === 'production') {
  console.log('  ⚠️  Mode PRODUCTION détecté');

  if (process.env.JWT_SECRET.includes('dev-secret')) {
    console.log('  🚨 JWT_SECRET ne doit PAS être la clé de développement!');
  }

  if (process.env.SERVER_URL.includes('localhost')) {
    console.log('  🚨 SERVER_URL pointe vers localhost en production!');
  }
} else {
  console.log('  ✅ Mode DEVELOPMENT - OK pour développement local');
}

// 7. Test d'import des dépendances
console.log('\n✓ Étape 7: Vérification des dépendances essentielles');
const dependencies = [
  'express',
  'mongoose',
  'jsonwebtoken',
  'bcryptjs',
  'cors',
  'dotenv',
];

let allDepsPresent = true;
try {
  dependencies.forEach(dep => {
    require(dep);
    console.log(`  ✅ ${dep}`);
  });
} catch (err) {
  console.log(`  ❌ Dépendance manquante: ${err.message}`);
  console.log('     Exécutez: npm install');
  allDepsPresent = false;
}

// Résultat final
console.log('\n' + '='.repeat(60));
if (allPresent && allDepsPresent) {
  console.log('✅ Configuration OK - Serveur prêt à démarrer!\n');
  console.log('Commande: npm start\n');
  process.exit(0);
} else {
  console.log('❌ Erreurs de configuration détectées\n');
  process.exit(1);
}
