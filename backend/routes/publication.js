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
router.get('/:id', authentification, publicationControle.affichagePublication);
router.get('/', authentification, publicationControle.affichageToutesPublications);
router.get('/user/:id', authentification, publicationControle.affichagePublicationsUtilisateur);
router.put('/:id', authentification, multer, publicationControle.modificationPublication);
router.delete('/:id', authentification, publicationControle.suppressionPublication);

// Export du router
module.exports = router;