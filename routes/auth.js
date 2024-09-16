const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
    // res.send('respond with a resource');
    res.status(200).json({ res: 'login route to implement' });
});

/* GET user info. */
router.get('/logout', function(req, res, next) {
    // res.send('logout route to implement');
    res.status(200).json({ res: 'logout route to implement' });
});

module.exports = router;
