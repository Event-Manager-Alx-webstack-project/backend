const { Sequelize, Op } = require('sequelize')
const { Event, Category, UserLike, EventCategory } = require('../models')

const createEvent = async (req, res) => {
    try {
        const { organizer_id, name, description, location, categories } = req.body
        const event = await Event.create({
            organizer_id,
            name,
            description,
            location
        })
        

        if (categories && categories.length > 0) {
            // const categoryInstances = await Category.findAll({
            //     where: {
            //         // category_id: categories
            //         name: {
            //             [Sequelize.Op.in]: categories
            //         }
            //     }
            // })
            for (const categoryName of categories) {
                const category = await Category.findOrCreate({
                    where: {
                        name: categoryName
                    }
                })
                await EventCategory.create({
                    event_id: event.id,
                    category_id: category[0].id
                })
            }
            const createdEvent = await Event.findOne({
                where: { id: event.id },
                include: [
                    {
                        model: Category,
                        through: { attributes: [] }
                    }
                ]
            })
            // await event.addCategories(categoryInstances)
            res.status(201).json(createdEvent)
        }
    } catch (error) {
        res.status(201).json({ error: error.message })
    }
}

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEventId = async (req, res) => {
    try {
        const { event_id } = req.params
        const event = await Event.findByPk(event_id, {
            include: [Category]
        })
        if (!event) {
            return res.status(404).json({ error: 'Event not found' })
        }
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEventsByCategory = async (req, res) => {
    try {
        const { categories } = req.body
        const events = await Event.findAll({
            include: {
                model: Category,
                where: { 
                    name: {[Op.in]: categories} 
                }
            }
        })
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEventsByUser = async (req, res) => {
    try {
        const { user_id } = req.params
        const events = await Event.findAll({ where: { organizer_id: user_id } })
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getEventsByUserAndCategory = async (req, res) => {
    try {
        const { user_id, category_id } = req.params
        const events = await Event.findAll({
            where: { organizer_id: user_id },
            include: {
                model: Category,
                where: { category_id }
            }
        })
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const updateEvent = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { title, description, location, categories } = req.body
        const event = await Event.findByPk(event_id)
        if (!event) {
            return res.status(404).json({ error: 'Event not found' })
        }
        await event.update({ title, description, location });

        if (categories && categories.length > 0) {
            const categoryInstances = await Category.findAll({
                where: {
                    category_id: categories
                }
            })
            await event.setCategories(categoryInstances)
        }

        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const likeEvent = async (req, res) => {
    try {
        const { user_id, event_id } = req.body
        const like = await UserLike.create({ user_id, event_id })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const dislikeEvent = async (req, res) => {
    try {
        const { user_id, event_id } = req.body
        const like = await UserLike.findOne({ where: { user_id, event_id } })
        if (like) {
            await like.destroy();
            res.status(200).json({ message: 'Event disliked successfully' })
        } else {
            res.status(401).json({ error: 'Like not found' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createEvent,
    getEventsByCategory,
    getEventsByUser,
    getEventsByUserAndCategory,
    updateEvent,
    likeEvent,
    dislikeEvent,
    getAllEvents,
    getEventId
}