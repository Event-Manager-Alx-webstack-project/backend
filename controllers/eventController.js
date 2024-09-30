// <<<<<<< HEAD
// const { Op } = require('sequelize')
// const { Event, Category, UserLike, EventCategory, UserEventRegistration } = require('../models')
// =======
const { Op, Sequelize, where } = require('sequelize')
const { Event, Category, UserLike, EventCategory, User, Comment } = require('../models')
// >>>>>>> comment/following

const createEvent = async (req, res) => {
    try {
        const { organizer_id, description, location, categories, isPaid, price, thumbnail, title, date
        } = req.body
        const event = await Event.create({
            organizer_id,
            name: title,
            description,
            location,
            isPaid,
            price,
            thumbnail,
            date
        })
        

        if (categories && categories.length > 0) {
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
            res.status(201).json(createdEvent)
        }
        res.status(201).json({ msg: 'Event successfully created' })
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

const deleteEvent = async (req, res) => {
    const { event_id } = req.params

    try {
        const event = await Event.findByPk(event_id)
    
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        await event.destroy();
    
        return res.json({ message: 'Event deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
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

const getEvents = async (req, res) => {
    try {
        let { categories, user } = req.query
        if (categories) {
            // get event by category
            if (!Array.isArray(categories)) {
                categories = [categories]
            }
    
            const events = await Event.findAll({
                include: [
                    {
                        model: Category,
                        where: {
                            name: {
                                [Op.in]: categories
                            }
                        },
                        through: { attributes: [] }
                    }
                ]
            })

            res.status(200).json(events)
        } else if (user) {
            // get event by user
            const events = await Event.findAll({ where: { organizer_id: user } })
            
            res.status(200).json(events)
        }
         else {
            const events = await Event.findAll();
            res.status(200).json(events)
        }
    } catch (error) {
        console.error('Error', error)
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
        const { event_id } = req.params
        const { user_id } = req.body
        const existingLike = await UserLike.findOne({
            where: { event_id, user_id }
        })

        if (existingLike) {
            return res.status(400).json({ message: 'Already Liked' })
        }
        
        await UserLike.create({ user_id, event_id }),
        await Event.increment('likes_count', {
            where: {
                id: event_id
            }
        })
        res.json({ message: 'Event Liked!' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const dislikeEvent = async (req, res) => {
    try {
        const { event_id } = req.params
        const { user_id } = req.body
        const like = await UserLike.destroy({ where: { user_id, event_id } })

        if (like === 0) {
            return res.status(400).json({ message: 'Event not liked' })
        }
        await Event.decrement('likes_count', {
            where: {
                id: event_id
            }
        })

        res.json({message: 'Event disliked'})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const commentEvent = async (req, res) => {
    try {
        const { event_id } = req.params
        const { user_id } = req.body
        const { text } = req.body

        if (!event_id) {
            return res.status(400).json({ message: 'Event not found' })
        }
        if (!user_id) {
            return res.status(400).json({ message: 'Unauthorized' })
        }
        await Comment.create({
            user_id,
            event_id,
            text
        });

        res.json({message: 'Event commented'})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const registerForEvent = async (req, res) => {
    const { event_id } = req.params
    const { user_id } = req.body

    const event = await Event.findByPk(event_id)

    if (!event) {
        return res.status(404).json({ message: 'Event not found' })
    }

    try {
        await UserEventRegistration.create({
            user_id,
            event_id,
        })
        return res.json({ message: 'Registration for event successful' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const handlePayment = async (req, res) => {
    const { event_id } = req.params
    const { user_id } = req.body

    const event = await Event.findByPk(event_id)

    if (!event) {
        return res.status(404).json({ message: 'event does not exist' })
    }
    const isExist = await UserEventRegistration.findOne({
        where: {
            user_id,
            event_id
        }
    })

    if (!isExist) {
        return res.status(404).json({ message: 'User is not registered for event' })
    }


    if (event.isPaid) {
        await isExist.update({
            paymentStatus: 'paid'
        })

        return res.json({ message: 'Payment successful' })
    }
    else {
        return res.status(400).json({ message: 'Event is free!' })
    }
}

module.exports = {
    createEvent,
    getEvents,
    getEventsByUserAndCategory,
    updateEvent,
    likeEvent,
    dislikeEvent,
    getEventId,
    registerForEvent,
    handlePayment,
    deleteEvent,
    commentEvent,
}