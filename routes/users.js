const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/info', function(req, res, next) {
  // res.send('respond with a resource');
  res.status(200).json({ res: 'respond with user ressources'})
});

/* GET user info. */
router.post('/register', function(req, res, next) {
  // res.send('respond with a resource on me');
  res.status(201).json({ res: `${req.body.email} ${req.body.password}`});
});

module.exports = router;
