// import UsersController from '../controllers/UsersController';
const UsersController = require("../controllers/UsersController");

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.status(200).json({ res: 'respond with all user ressources'})
});

/* GET user infos. */
router.get('/profile', UsersController.getMe);

/* PUT update ser infos. */
router.put('/profile', UsersController.updateInfos);

/* Post register user. */
router.post('/register', UsersController.postNew);
// router.post('/register', function(req, res, next) {
//   // res.send('respond with a resource on me');
//   res.status(201).json({ res: `${req.body.email} ${req.body.password}`});
// });
router.route('/:user_id/allEvents').get(UsersController.getAllRegisteredEvents)

module.exports = router;
