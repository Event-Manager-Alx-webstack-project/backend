const { sequelize } = require('../config/db')
const User = require('./user')
const { DataTypes } = require('sequelize')
const Category = require('./category')

const UserCategory = sequelize.define("UserCategory", {
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.UUID,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    timestamps: false
})

module.exports = UserCategory;