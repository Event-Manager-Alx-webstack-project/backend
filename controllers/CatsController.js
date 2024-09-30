// <<<<<<< HEAD
// const { Op } = require('sequelize')
// const { Event, Category, UserLike, EventCategory, UserEventRegistration } = require('../models')
// =======
const { Op, Sequelize, where } = require('sequelize')
const { Event, Category, UserLike, EventCategory, User, Comment } = require('../models')
// >>>>>>> comment/following

const createCat = async (req, res) => {
    try {
        const { organizer_id, name, description, location, categories, isPaid } = req.body
        const event = await Category.create({
            name,
        })} catch (e) {
        console.error(e);
    }
}

const getEventCategories = async (req, res) => {
    let categories;
    try {
        categories = await Category.findAll({attributes: ['name', 'id'] });
    } catch (e) {
        console.error(e);
    }
    if (!categories) {
        res.status(401).json({ error: 'not found' });
        return;
    }

    res.status(200).json({
        categories
    });
}


module.exports = {
    createCat,
    getEventCategories
}