const { Router } = require('express')
const { getAllEvents, createEvent, getEvents, getEventsByUser, likeEvent, dislikeEvent, getEventId, commentEvent} = require('../controllers/eventController')
const eventRoutes = Router()

// eventRoutes.route('/').get(getAllEvents)
// eventRoutes.route('/user/:id').get(getEventsByUser)
eventRoutes.route('/').post(createEvent)
eventRoutes.route('/:event_id').get(getEventId)
eventRoutes.route('/').get(getEvents)
eventRoutes.route('/:event_id/like').post(likeEvent)
eventRoutes.route('/:event_id/dislike').post(dislikeEvent)

eventRoutes.route('/:event_id/comment').post(commentEvent);


module.exports = eventRoutes
