// Import de sequelize
const { Sequelize } = require("sequelize");

// Import de la configuration de sequelize
const db = require("../config/sequelize");

// Création du modèle défini
const dislikeCommModel = db.define("dislikecomment", {
    user_dislike_comment_id: { type: Sequelize.INTEGER, allowNull: false },
    post_dislike_comment_id: { type: Sequelize.INTEGER, allowNull: false },
    comment_dislike_comment_id: { type: Sequelize.INTEGER, allowNull: false }
});

// Export du modèle
module.exports = dislikeCommModel;