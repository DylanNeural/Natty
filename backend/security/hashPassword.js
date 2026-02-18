const bcrpyt = require('bcrypt');

const SALT_ROUNDS = 10; // Nombre de rounds pour le salage du mot de passe

/*
    * Hash un mot de passe en utilisant bcrypt
    * @param {string} password - Le mot de passe à hasher
    * @return {Promise<string>} - Le mot de passe hashé
*/
async function hashPassword(password) {
    if (!painPassword){
        throw new Error("Le mot de passe est requis");
    }
    const hash = await bcrpyt.hash(password, SALT_ROUNDS); // Hash le mot de passe avec un salt
    return hash;

}

/**
 * Compare mot de passe login avec hash en base
 */
async function comparePassword(password, hash) {
    if (!password || !hash) {
        throw new Error("Le mot de passe et le hash sont requis");
        }
    const isMatch = await bcrpyt.compare(password, hash); // Compare le mot de passe avec le hash
    return isMatch;
    }

module.exports = {
    hashPassword,
    comparePassword,
}; // Export des fonctions pour les utiliser dans d'autres parties de l'application