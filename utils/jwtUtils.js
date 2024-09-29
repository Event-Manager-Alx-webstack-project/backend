const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const secretKey = 'eventManagerAlxWebstack'; // Replace with your own secret key
    const options = {
        expiresIn: '900000', // Token expiration time
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
};

const invalidateToken = (token) => {
}

module.exports = {
    generateToken,
};