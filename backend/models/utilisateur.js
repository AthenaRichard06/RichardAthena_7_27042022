// Import de sequelize
const { Sequelize } = require("sequelize");

// Import de la configuration de sequelize
const db = require("../config/sequelize");

// Création du modèle défini
const userModel = db.define("user", {
    nom: { type: Sequelize.STRING, allowNull: false },
    prenom: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    motdepasse: { type: Sequelize.STRING, allowNull: false },
    fonction: { type: Sequelize.STRING, allowNull: false },
    photo: { type: Sequelize.STRING, allowNull: true, defaultValue: "http://localhost:3000/images/default-profile.jpg" },
    biographie: { type: Sequelize.STRING, allowNull: true },
    administrateur: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: "false"}
}, {
    timestamps: false
});

// Import des modèles
const postModel = require("./publication");
const commentModel = require("./commentaire");
const likePubliModel = require("./likePublication");

// Relations entre les modèles
userModel.hasMany(postModel, { foreignKey: "user_post_id", onUpdate: "cascade", onDelete: "cascade" });
postModel.belongsTo(userModel, { foreignKey: "user_post_id", onUpdate: "cascade", onDelete: "cascade"});

userModel.hasMany(commentModel, { foreignKey: "user_comment_id", onUpdate: "cascade", onDelete: "cascade" });
commentModel.belongsTo(userModel, { foreignKey: "user_comment_id", onUpdate: "cascade", onDelete: "cascade" });

userModel.hasMany(likePubliModel, { foreignKey: "user_like_post_id" });
likePubliModel.belongsTo(userModel, { foreignKey: "user_like_post_id" });


// Export du modèle
module.exports = userModel;