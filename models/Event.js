const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');
const User = require('./user');

const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50)
    },
    description: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE
    },
    location: {
        type: DataTypes.STRING(40)
    },
    image: {
        type: DataTypes.BLOB
    },
    organizer_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        }
    },
    likes_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    share_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})


module.exports = Event;