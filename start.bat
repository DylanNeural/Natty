@echo off
REM ================================
REM NATTY - Script de Démarrage
REM Windows PowerShell / CMD
REM ================================

echo.
echo ========================================
echo   NATTY - Démarrage du Serveur Local
echo ========================================
echo.

REM Vérifier Node.js
echo [1/5] Vérification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo Téléchargez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js trouvé

REM Vérifier npm
echo.
echo [2/5] Vérification de npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm n'est pas installé
    pause
    exit /b 1
)
echo ✅ npm trouvé

REM Vérifier .env
echo.
echo [3/5] Vérification du fichier .env...
if not exist ".env" (
    echo ❌ Fichier .env non trouvé
    echo Créez .env avec: cp .env.example .env
    pause
    exit /b 1
)
echo ✅ Fichier .env présent

REM Vérifier node_modules
echo.
echo [4/5] Vérification des dépendances...
if not exist "node_modules" (
    echo ⚠️  Dépendances manquantes, installation...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install a échoué
        pause
        exit /b 1
    )
) else (
    echo ✅ Dépendances présentes
)

REM Valider la configuration
echo.
echo [5/5] Validation de la configuration...
call node test-env-config.js
if errorlevel 1 (
    echo ❌ Configuration invalide
    echo Voir ENV_SETUP_GUIDE.md pour l'aide
    pause
    exit /b 1
)

REM Lancer le serveur
echo.
echo ========================================
echo   ✅ Démarrage du serveur...
echo ========================================
echo.
echo 🌐 Serveur: http://localhost:5000
echo 📖 API Docs: Natty.postman_collection.json
echo.

node server.js

REM Si le serveur s'arrête, demander si relancer
if errorlevel 1 (
    echo.
    echo ❌ Le serveur s'est arrêté avec une erreur
    echo Vérifiez les logs dans logs/app.log
)
pause
