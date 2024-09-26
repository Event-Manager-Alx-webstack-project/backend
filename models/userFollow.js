const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const User = require('./user')

const UserFollow = sequelize.define("UserFollow", {
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    },
    organizer_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    }
})

module.exports = UserFollow;