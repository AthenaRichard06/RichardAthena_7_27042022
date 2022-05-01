// Import de sequelize
const { Sequelize } = require("sequelize");

// Import de la configuration de sequelize
const db = require("../config/sequelize");

// Création du modèle défini
const postModel = db.define("post", {
    texte: { type: Sequelize.STRING, allowNull: false },
    image: { type: Sequelize.STRING, allowNull: true },
    date: { type: Sequelize.DATETIME, allowNull: false },
    user_post_id: { type: Sequelize.INTEGER, allowNull: false }
});

// Export du modèle
module.exports = postModel;