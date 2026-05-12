# 🚀 Natty - Guide Démarrage Rapide

## 📋 Prérequis

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **MongoDB** (local ou MongoDB Atlas)
- **Git**

Vérifiez l'installation:
```bash
node --version
npm --version
```

---

## ⚡ Installation et Démarrage (2 minutes)

### 1️⃣ Cloner et installer les dépendances
```bash
cd Natty
npm install
```

### 2️⃣ Configurer l'environnement
```bash
# Copier le template
cp .env.example .env

# Éditer .env avec vos paramètres (voir ENV_SETUP_GUIDE.md)
```

**Minimum pour localhost:**
```env
NODE_ENV=development
PORT=5000
HOST=localhost
SERVER_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/natty
JWT_SECRET=dev-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3️⃣ Lancer MongoDB (si local)
```bash
# Windows
mongod

# macOS (avec Homebrew)
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 mongo:6
```

### 4️⃣ Démarrer le serveur
```bash
npm start
# ou directement
node server.js
```

✅ Le serveur est accessible à: **http://localhost:5000**

---

## 🎯 Commandes Utiles

```bash
# Tester les routes
npm run test

# Lancer le serveur en mode watch
npm run dev

# Valider les variables d'env
node backend/config/env-validator.js

# Voir les logs
tail -f logs/app.log
```

---

## 📁 Structure du Projet

```
Natty/
├── backend/
│   ├── config/           # Configuration DB, env, etc.
│   ├── models/           # Modèles Mongoose
│   ├── routes/           # Routes API
│   ├── security/         # Auth, validation, rate-limit
│   ├── ia/               # Services IA (ChatBot, etc.)
│   └── logs/             # Logger
├── frontend/             # React Native (Expo)
├── web/                  # Web frontend (Vite)
├── natty-mobile/         # Mobile app
├── .env                  # Variables d'environnement (⛔ ne pas commiter)
├── .env.example          # Template des variables
├── server.js             # Point d'entrée
└── ENV_SETUP_GUIDE.md    # Documentation détaillée
```

---

## 🔗 Endpoints Principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/register` | POST | Créer un compte |
| `/api/auth/login` | POST | Se connecter |
| `/api/auth/logout` | POST | Se déconnecter |
| `/api/meals` | GET | Lister les repas |
| `/api/chatbot` | POST | Chat avec IA |
| `/api/progress` | GET | Voir sa progression |

Documentation complète: `Natty.postman_collection.json` (importer dans Postman)

---

## 🧪 Tester l'API

### Avec cURL
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Avec Postman
1. Importer: `Natty.postman_collection.json`
2. Configurer l'environnement avec les variables Postman
3. Envoyer les requêtes

### Avec VS Code REST Client
Créer un fichier `.http`:
```http
### Connexion
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🆘 Dépannage

### ❌ "Cannot find module 'dotenv'"
```bash
npm install
```

### ❌ "ECONNREFUSED" (MongoDB)
```bash
# Vérifier que MongoDB est lancé
mongod  # Windows/Mac/Linux
# ou
docker ps  # Vérifier les conteneurs
```

### ❌ "Port 5000 déjà utilisé"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### ❌ "CORS error"
Vérifier `CORS_ORIGINS` dans `.env` - doit inclure l'URL du frontend

### ❌ "JWT token invalid"
S'assurer que `JWT_SECRET` est le même côté client et serveur

---

## 📚 Ressources Utiles

- 📖 [Documentation Express.js](https://expressjs.com/)
- 🗄️ [Documentation MongoDB](https://docs.mongodb.com/)
- 🔐 [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- 🔍 [Postman Documentation](https://learning.postman.com/)

---

## 👨‍💻 Développement

### Hot Reload
Installer **nodemon**:
```bash
npm install --save-dev nodemon
npx nodemon server.js
```

### Logs en temps réel
```bash
tail -f logs/app.log
```

### Déboguer dans VS Code
Ajouter dans `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Natty Server",
      "program": "${workspaceFolder}/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 🔒 Sécurité

✅ **À faire:**
- Utiliser `https` en production
- Changer `JWT_SECRET` en production
- Valider toutes les entrées utilisateur
- Utiliser reCAPTCHA pour les formulaires

❌ **À éviter:**
- Commiter `.env` avec des clés réelles
- Stocker des secrets en dur dans le code
- Désactiver la validation CORS en production

---

**Besoin d'aide?** 
- Consultez `ENV_SETUP_GUIDE.md` pour une documentation détaillée
- Ouvrez une issue sur GitHub
- Contactez l'équipe dev

Happy coding! 🎉
