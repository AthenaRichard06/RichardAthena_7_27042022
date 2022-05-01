// Import de sequelize
const { Sequelize } = require("sequelize");

// Import de la configuration de sequelize
const db = require("../config/sequelize");

// Création du modèle défini
const likeCommModel = db.define("likecomment", {
    user_like_comment_id: { type: Sequelize.INTEGER, allowNull: false },
    post_like_comment_id: { type: Sequelize.INTEGER, allowNull: false },
    comment_like_comment_id: { type: Sequelize.INTEGER, allowNull: false }
});

// Export du modèle
module.exports = likeCommModel;