const { sequelize } = require('../config/db')
const Event = require('./event')
const { DataTypes } = require('sequelize')
const Category = require('./category')

const EventCategory = sequelize.define("EventCategory", {
    event_id: {
        type: DataTypes.UUID,
        references: {
            model: Event,
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

module.exports = EventCategory;