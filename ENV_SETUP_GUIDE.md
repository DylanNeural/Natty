# Guide de Configuration de l'Environnement - Natty

## 🚀 Configuration Rapide (Développement Local)

### 1. Installer les dépendances
```bash
npm install
```

### 2. Créer et configurer le fichier .env
```bash
# Copier le template
cp .env.example .env
```

### 3. Configurer .env pour le développement local

**Variables essentielles pour localhost:**

```env
NODE_ENV=development
PORT=5000
HOST=localhost
SERVER_URL=http://localhost:5000

# MongoDB local (assurez-vous que MongoDB est en cours d'exécution)
MONGODB_URI=mongodb://localhost:27017/natty

# JWT (générez une clé forte)
JWT_SECRET=dev-secret-natty-change-in-production

# CORS pour localhost
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080

# OpenAI (optionnel pour tester)
OPENAI_API_KEY=sk-proj-your-key-here
```

### 4. Démarrer le serveur
```bash
npm start
# ou
node server.js
```

Le serveur sera accessible à `http://localhost:5000`

---

## 📋 Variables d'Environnement Expliquées

### 🌐 Server
- **NODE_ENV**: `development` | `staging` | `production`
- **PORT**: Port d'écoute (défaut: 5000)
- **HOST**: Hostname (défaut: localhost)
- **SERVER_URL**: URL complète du serveur (utilisée dans les emails, redirects, etc.)

### 🗄️ Base de Données
**Développement local:**
```env
MONGODB_URI=mongodb://localhost:27017/natty
```

**Production (MongoDB Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natty?retryWrites=true&w=majority
```

### 🔐 Sécurité
- **JWT_SECRET**: Clé secrète pour signer les tokens JWT
  - 🔴 **IMPORTANT**: Changez-la en production!
  - Générer une clé forte: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **JWT_EXPIRES_IN**: Durée d'expiration des tokens (défaut: 7d)

### 🤖 reCAPTCHA
- **RECAPTCHA_SITE_KEY**: Clé publique (côté frontend)
- **RECAPTCHA_SECRET_KEY**: Clé privée (côté serveur) - 🔴 **À PROTÉGER**

Obtenez les clés: https://www.google.com/recaptcha/admin

### 🔀 CORS
**Pour le développement avec plusieurs frontends:**
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8080
```

**Ports courants à inclure:**
- `3000` - React standard
- `5173` - Vite
- `8080` - Angular, Vue par défaut
- `19006` - Expo web

**Pour la production:**
```env
CORS_ORIGINS=https://natty.app,https://app.natty.app,https://natty.vercel.app
```

### ðŸ”’ HTTPS / Reverse Proxy (Production)
En production, HTTPS est gÃ©nÃ©ralement terminÃ© par l'hÃ©bergeur (Render/Railway/Vercel) ou un reverse proxy (Nginx).

Variables recommandÃ©es:
```env
NODE_ENV=production
SERVER_URL=https://api.natty.app
TRUST_PROXY=1
ENFORCE_HTTPS=1
COOKIE_SAMESITE=lax
```

âš ï¸ Si le frontend et le backend sont sur des domaines diffÃ©rents, il peut Ãªtre nÃ©cessaire d'utiliser:
```env
COOKIE_SAMESITE=none
```
(avec HTTPS obligatoire).

### 🧠 OpenAI (Chatbot)
- **OPENAI_API_KEY**: Clé API OpenAI
  - Obtenir: https://platform.openai.com/api-keys
  - 🔴 **À PROTÉGER**
- **OPENAI_CHAT_MODEL**: Modèle utilisé (gpt-4o-mini, gpt-4, etc.)
- **OPENAI_CHAT_TIMEOUT_MS**: Délai d'attente en ms
- **OPENAI_CHAT_MAX_HISTORY**: Nombre de messages en historique

### 📊 Logging
- **LOG_LEVEL**: `error` | `warn` | `info` | `debug` | `trace`
- **LOG_FILE**: Chemin du fichier de log

### ⏱️ Rate Limiting
- **RATE_LIMIT_WINDOW_MS**: Fenêtre de temps (900000 = 15 min)
- **RATE_LIMIT_MAX_REQUESTS**: Max requêtes par fenêtre

### 🎯 Features Flags
```env
ENABLE_CHATBOT=true
ENABLE_QR_SCANNER=true
ENABLE_RECAPTCHA=true
```

---

## ⚠️ Bonnes Pratiques de Sécurité

### ✅ À Faire
- ✅ Garder `.env` local et **JAMAIS** le commiter
- ✅ Utiliser `.env.example` comme template
- ✅ Générer des clés secrètes fortes en production
- ✅ Utiliser des variables d'environnement différentes par environnement
- ✅ Documenter toutes les variables requises
- ✅ Valider les variables au démarrage

### ❌ À NE PAS FAIRE
- ❌ Commiter `.env` avec des clés réelles
- ❌ Utiliser les mêmes secrets en dev et prod
- ❌ Mettre des clés API publiquement
- ❌ Stocker des secrets en dur dans le code
- ❌ Partager `.env` par email ou chat

---

## 🐳 Avec Docker

### Dockerfile (exemple)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

# Variables d'env pour la prod
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
```

### docker-compose.yml (avec MongoDB)
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/natty
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Lancer: `docker-compose up`

---

## 🚨 Dépannage Courant

### "MONGODB_URI is undefined"
→ Vérifier que `.env` existe et contient `MONGODB_URI`

### "JWT token is invalid"
→ Vérifier que `JWT_SECRET` est le même en dev et prod

### "CORS error"
→ Ajouter l'URL frontend à `CORS_ORIGINS`

### "reCAPTCHA validation failed"
→ Vérifier les clés site et secret sur https://www.google.com/recaptcha/admin

### Impossible de se connecter à MongoDB local
→ Lancer MongoDB: `mongod` (Windows) ou `brew services start mongodb-community` (Mac)

---

## 📚 Ressources

- [Node.js dotenv](https://www.npmjs.com/package/dotenv)
- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Dernière mise à jour**: 2026-04-01
**Auteur**: Natty Development Team
