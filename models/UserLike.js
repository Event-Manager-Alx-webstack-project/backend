const { sequelize } = require('../config/db')
const User = require('./user')
const Event = require('./event')
const { DataTypes } = require('sequelize')

const UserLike = sequelize.define("UserLike", {
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    },
    event_id: {
        type: DataTypes.UUID,
        references: {
            model: Event,
            key: 'id'
        }
    }
})

module.exports = UserLike;