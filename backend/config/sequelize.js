// Import des variables d'environnement stockées dans le fichier .env
const dotenv = require("dotenv");
dotenv.config();

// Import de Sequelize
const { Sequelize } = require('sequelize');

// Création de la base de données via Sequelize
const sequelize = new Sequelize(`${process.env.SQL_Nom}`, `${process.env.SQL_Pseudo}`, `${process.env.SQL_Motdepasse}`, {
    host: `${process.env.SQL_Host}`,
    dialect: `${process.env.SQL_Dialect}`
});

module.exports = sequelize;