const { sequelize } = require('../config/db')
const { DataTypes } = require('sequelize')
const Category = sequelize.define("category", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true

    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Category;