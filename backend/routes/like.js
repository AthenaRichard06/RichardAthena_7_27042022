// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du contrôleur publication
const likeControle = require ("../controllers/like");

// Import du middleware d'authentification
const authentification = require ("../middleware/authentification");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.post('/posts/:id', authentification, likeControle.likePublication);
router.get('/posts/:id', authentification, likeControle.affichageTousLikes);

// Export du router
module.exports = router;