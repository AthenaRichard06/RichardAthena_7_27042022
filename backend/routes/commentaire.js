// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du contrôleur commentaire
const commentaireControle = require ("../controllers/commentaire");

// Import du middleware d'authentification
const authentification = require ("../middleware/authentification");

// Import du middleware mutler
const multer = require ("../middleware/multer-config");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.post('/', authentification, multer, commentaireControle.creationCommentaire);
router.get('/:id', authentification, commentaireControle.affichageCommentaires);
router.put('/:id', authentification, multer, commentaireControle.modificationCommentaire);
router.delete('/:id', authentification, commentaireControle.suppressionCommentaire);

// Export du router
module.exports = router;