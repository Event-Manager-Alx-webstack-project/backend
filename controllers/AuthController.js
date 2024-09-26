const uuid = require('uuid');
const uuidv4 = uuid.v4;
const sha1 = require('sha1');
const User = require('../models/user')
const redisClient = require('../utils/redis')


/**
 * handles routes to auth
 */
class AuthController {
    /**
     * sign-in the user by generating a new authentication token:
     * @param {*} request
     * @param {*} response
     */
    static async login(request, response) {
        console.log('Log user');
        // const { user } = request;
        const authorization = request.headers.authorization || null;
        if (!authorization) {
            console.log('auth error');
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // grab the encoded value
        const encoded = authorization.split(' ')[1];
        const decoded = Buffer.from(encoded, 'base64').toString();
        const email = decoded.split(':')[0];
        const password = decoded.split(':')[1];
        // console.log(username+' '+password);
        let user;
        try {
            user = await User.findOne({  where: { email } , raw: true,},);
        } catch (e) {
            console.error(e);
        }
        console.log(user);
        if (!user || sha1(password) !== user.password) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const token = uuidv4();
        await redisClient.set(`auth_${token}`, user.id.toString(), 24 * 60 * 60);
        response.status(200).json({ token });
    }

    /**
     * logout user
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    static async logout(request, response) {
        const token = request.headers['x-token'];

        if (!token) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        console.log(token);
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        console.log(userId);
        let user;
        try {
            user = await User.findOne({ where: { id: userId } });
        } catch (e) {
            console.error(e);
        }
        if (!user) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await redisClient.del(`auth_${token}`);
        response.status(204).send();
    }
}
module.exports = AuthController;