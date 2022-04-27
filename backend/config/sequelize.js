// Import de Sequelize
const { Sequelize } = require('sequelize');

// Création de la base de données via Sequelize
const sequelize = new Sequelize(`${process.env.SQL_Nom}`, `${process.env.SQL_Pseudo}`, `${process.env.SQL_Motdepasse}`, {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;