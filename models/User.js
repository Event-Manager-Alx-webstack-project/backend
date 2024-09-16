const { DataTypes, Sequelize } = require('sequelize')
const { sequelize } = require('../config/db')

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
        type: DataTypes.STRING(50)
    },
    lastName: {
        type: DataTypes.STRING(50)
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(60),
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
    },
    profile_picture: {
        type: DataTypes.BLOB
    },
    follows_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    followers_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
})

module.exports = User;