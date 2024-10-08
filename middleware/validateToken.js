// Middleware for JWT Token Validation
const jwt = require('jsonwebtoken');
const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        console.log(token);

        jwt.verify(token, 'eventManagerAlxWebstack', (err, payload) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token',
                });
            } else {
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Token is not provided',
        });
    }
};

module.exports = validateToken;