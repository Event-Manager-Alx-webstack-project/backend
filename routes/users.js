// import UsersController from '../controllers/UsersController';
const UsersController = require("../controllers/UsersController");

const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateToken');

/* GET users listing. */
router.get('/all', validateToken, UsersController.getAll);

/* GET user infos. */
router.get('/profile', validateToken, UsersController.getMe);

/* PUT update ser infos. */
router.put('/profile', validateToken, UsersController.updateInfos);

/* test middleware */
// router.use(validateToken);
router.get('/protected',validateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the protected route!',
    user: req.user,
  });
});

/* Post register user. */
router.post('/register', UsersController.postNew);
// router.post('/register', function(req, res, next) {
//   // res.send('respond with a resource on me');
//   res.status(201).json({ res: `${req.body.email} ${req.body.password}`});
// });
router.route('/:user_id/allEvents').get(UsersController.getAllRegisteredEvents)

router.post('/:f_user_id/follow', UsersController.follow);

module.exports = router;
