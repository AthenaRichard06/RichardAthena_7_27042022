// Import de sequelize
const { Sequelize } = require("sequelize");

// Import de la configuration de sequelize
const db = require("../config/sequelize");

// Création du modèle défini
const postModel = db.define("post", {
    texte: { type: Sequelize.STRING, allowNull: false },
    photo: { type: Sequelize.STRING, allowNull: true },
    user_post_id: { type: Sequelize.INTEGER, allowNull: false }
}, {
    timestamps: true,
    updatedAt: false,
    createdAt: true
});

// Export du modèle
module.exports = postModel;