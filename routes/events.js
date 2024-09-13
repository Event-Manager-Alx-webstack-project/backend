const express = require('express');
const router = express.Router();

/* GET events listing. */
router.get('/', function(req, res, next) {
    res.send('respond with all events resource');
    // res.status().json({})
});

/* GET user info. */
router.get('/:id', function(req, res, next) {
    res.send('respond with specific event resource on me');
    // res.status().json({})
});

module.exports = router;
