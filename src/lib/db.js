const mysql2 = require('mysql2');
const { Sequelize } = require('sequelize');

// console.log('DB_HOST:', process.env.DB_HOST);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        dialectModule: mysql2,
        logging: false, // Optional: disable SQL logging
    }
);

let connected = false;

if (!connected) {
    sequelize.authenticate()
        .then(() => {
            console.log("✅ Database connected");
            connected = true;
        })
        .catch((error) => {
            console.error("❌ DB connection failed:", error);
        });
}

module.exports = sequelize;