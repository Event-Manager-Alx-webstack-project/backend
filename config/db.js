const { Sequelize } = require('sequelize');
require('dotenv').config();


// const DB_PORT = process.env.DB_PORT || '3306';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize('alx_test', DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});

const connectDB = async (sequelize) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }
}

module.exports = { connectDB, sequelize };