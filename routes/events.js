const { Router } = require('express')
const { getAllEvents, createEvent, getEventsByCategory, getEventsByUser, likeEvent, dislikeEvent, } = require('../controllers/eventController')
const eventRoutes = Router()

eventRoutes.route('/').get(getAllEvents)
eventRoutes.route('/').post(createEvent)
eventRoutes.route('/categories').get(getEventsByCategory)
eventRoutes.route('/user/:id').get(getEventsByUser)
eventRoutes.route('/like').post(likeEvent)
eventRoutes.route('/dislike').post(dislikeEvent)


module.exports = eventRoutes
