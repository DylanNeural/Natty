@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ============================================
echo 🚀 Natty - Démarrage complet (Back + Front)
echo ============================================

REM Couleurs
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

REM Installer les dépendances du backend
echo.
echo %BLUE%📦 Installation dépendances backend...%RESET%
if exist node_modules (
    echo ✓ node_modules existe déjà
) else (
    call npm install
)

REM Installer les dépendances du frontend
echo.
echo %BLUE%📦 Installation dépendances frontend...%RESET%
cd frontend
if exist node_modules (
    echo ✓ node_modules existe déjà
) else (
    call npm install
)
cd ..

REM Lancer le backend en arrière-plan
echo.
echo %GREEN%▶ Lancement du serveur backend...%RESET%
start "Natty Backend" cmd /k "node server.js"
timeout /t 2 /nobreak

REM Lancer le frontend en arrière-plan
echo.
echo %GREEN%▶ Lancement du serveur frontend...%RESET%
start "Natty Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak

REM Afficher les URLs
echo.
echo ============================================
echo %GREEN%✅ Servers démarrés!%RESET%
echo ============================================
echo.
echo 📱 Frontend:  %BLUE%http://localhost:3001%RESET%
echo 🔌 Backend:   %BLUE%http://localhost:5000%RESET%
echo 🗄️  Database:  %BLUE%MongoDB Atlas Cloud (natty.1vsjt0f.mongodb.net)%RESET%
echo.
echo %YELLOW%💡 Astuce: Importez Natty.postman_collection.json dans Postman pour tester l'API%RESET%
echo.
echo Fermer ces fenêtres fermera les serveurs.
echo.
pause
