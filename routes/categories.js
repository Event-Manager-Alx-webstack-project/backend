const { Router } = require('express')
const { createCat, getEvents, getEventCategories, deleteEvent, } = require('../controllers/CatsController')
const catsRouter = Router()
const validateToken = require('../middleware/validateToken');

catsRouter.route('/').post(validateToken, createCat)
catsRouter.route('/').get(getEventCategories)



module.exports = catsRouter
