// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du contrôleur utilisateur
const utilisateurControle = require ("../controllers/utilisateur");

// Import du middleware d'authentification
const authentification = require ("../middleware/authentification");

// Import du middleware mutler
const multer = require ("../middleware/multer-config");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.get('/:id', utilisateurControle.affichageCompte);
router.put('/:id', authentification, multer, utilisateurControle.modificationCompte);
router.delete('/:id', authentification, utilisateurControle.suppressionCompte);

// Export du router
module.exports = router;