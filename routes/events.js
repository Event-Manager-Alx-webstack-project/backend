const { Router } = require('express')
const { createEvent, getEvents, getEventsByUser, likeEvent, dislikeEvent, getEventId, handlePayment, registerForEvent, deleteEvent, } = require('../controllers/eventController')
const { commentEvent} = require('../controllers/eventController')
const eventRoutes = Router()
const validateToken = require('../middleware/validateToken');

eventRoutes.route('/').post(validateToken, createEvent)
eventRoutes.route('/:event_id').get(getEventId).delete(deleteEvent)
eventRoutes.route('/').get(validateToken, getEvents)
eventRoutes.route('/:event_id/like').post(likeEvent)
eventRoutes.route('/:event_id/dislike').post(dislikeEvent)
eventRoutes.route('/:event_id/pay').post(handlePayment)
eventRoutes.route('/:event_id/register').post(registerForEvent)

eventRoutes.route('/:event_id/comment').post(commentEvent);


module.exports = eventRoutes
