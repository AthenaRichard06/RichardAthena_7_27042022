// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du contrôleur publication
const publicationControle = require ("../controllers/publication");

// Import du middleware d'authentification
const authentification = require ("../middleware/authentification");

// Import du middleware mutler
const multer = require ("../middleware/multer-config");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.post('/', authentification, multer, publicationControle.creationPublication);
router.get('/:id', publicationControle.affichagePublication);
router.get('/', authentification, publicationControle.affichageToutesPublications);
router.put('/:id', authentification, multer, publicationControle.modificationPublication);

// Export du router
module.exports = router;