const { sequelize } = require('../config/db')
const { DataTypes } = require('sequelize')
const User = require('./user')
const Event = require('./event')

const UserEventRegistration = sequelize.define("UserEventRegistration", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
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
    },
    registrationData: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'failed', 'paid'),
        defaultValue: 'pending'
    }
})

module.exports = UserEventRegistration;