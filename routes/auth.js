const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const validateToken = require('../middleware/validateToken');

/* authenticate user */
router.get('/login',AuthController.login);

/* disconnect user. */
router.get('/logout', validateToken, AuthController.logout);

module.exports = router;
