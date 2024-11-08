const mysql2 = require('mysql2'); // Explicitly import mysql2
const { Sequelize } = require('sequelize');

console.log('DB_HOST:', process.env.DB_HOST);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        dialectModule: mysql2
    }
);

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch((error) => console.error('Unable to connect to the database:', error));

module.exports = sequelize;