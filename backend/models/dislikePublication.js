// Import de sequelize
const { Sequelize } = require("sequelize");

// Import de la configuration de sequelize
const db = require("../config/sequelize");

// Création du modèle défini
const dislikePubliModel = db.define("dislikepost", {
    user_dislike_post_id: { type: Sequelize.INTEGER, allowNull: false },
    post_dislike_post_id: { type: Sequelize.INTEGER, allowNull: false }
});

// Export du modèle
module.exports = dislikePubliModel;