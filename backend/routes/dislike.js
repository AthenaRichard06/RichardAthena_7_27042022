// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du contrôleur publication
const dislikeControle = require ("../controllers/like");

// Import du middleware d'authentification
const authentification = require ("../middleware/authentification");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.post('/posts/:id', authentification, dislikeControle.dislikePublication);
router.post('/posts/:id/comments/:commentId', authentification, dislikeControle.dislikeCommentaire);

// Export du router
module.exports = router;