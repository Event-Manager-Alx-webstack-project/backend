const { sequelize } = require('../config/db')
const { DataTypes } = require('sequelize')
const Event = require('./event')
const User = require('./user')

const Comment = sequelize.define("Comment", {
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
    text: {
        type: DataTypes.TEXT,
    },
    likes: {
        type: DataTypes.INTEGER
    }
})

module.exports = Comment;