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

// Import des modèles
const commentModel = require("../models/commentaire");

// Relations entre les modèles
postModel.hasMany(commentModel,{ foreignKey: "post_comment_id", onUpdate: "cascade", onDelete: "cascade" });
commentModel.belongsTo(postModel, { foreignKey: "post_comment_id", onUpdate: "cascade", onDelete: "cascade" });

// Export du modèle
module.exports = postModel;