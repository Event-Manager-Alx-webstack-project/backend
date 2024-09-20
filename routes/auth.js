const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

/* authenticate user */
router.get('/login',AuthController.login);

/* disconnect user. */
router.get('/logout', AuthController.logout);

module.exports = router;
