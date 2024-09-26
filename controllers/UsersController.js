const User = require('../models/user')
const Event = require('../models/event')
const { sequelize } = require('../config/db')
const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const { UserEventRegistration } = require('../models');

/**
 * contains user routes handlers
 */
class UsersController {
    /**
     * should create a new user in DB
     * @param {*} request
     * @param {*} response
     */
    static async postNew(request, response) {
        const email = request.body ? request.body.email : null;
        const password = request.body ? request.body.password : null;
        const firstName = request.body ? request.body.firstName : null;
        const lastName = request.body ? request.body.lastName : null;
        const username = request.body ? request.body.username : null;

        if (!email) {
            response.status(400).json({ error: 'Missing email' });
            return;
        }
        if (!firstName) {
            response.status(400).json({ error: 'Missing firstName' });
            return;
        }
        if (!lastName) {
            response.status(400).json({ error: 'Missing lastName' });
            return;
        }
        if (!username) {
            response.status(400).json({ error: 'Missing username' });
            return;
        }
        if (!password) {
            response.status(400).json({ error: 'Missing password' });
            return;
        }
        console.log(email);
        let user;
        try {
            user = await User.findOne({ where: { email } });
        } catch (e) {
            console.error(e);
        }

        if (user) {
            // console.log(user);
            response.status(400).json({ error: 'Already exist' });
            return;
        }

        try {
            await User.create({
                email,
                username,
                password: sha1(password),
                firstName,
                lastName
            });
            response.status(201).json({ res: "User created Successfully" });
        } catch (e) {
            response.status(500).json({ error:`Something went wrong, ${e}` });
            console.error(e)
            return;
        }
        // sequelize.sync().then(() => {
        //     // console.log('Book table created successfully!');
        //     User.create({
        //         email,
        //         password: sha1(password),
        //         firstName,
        //         lastName
        //     }).then(res => {
        //         // console.log(res)
        //     }).catch((error) => {
        //         console.error('Failed to create a new record : ', error);
        //     });
        //
        // }).catch((error) => {
        //     console.error('Unable to create table : ', error);
        // });

        }

    static async getMe(request, response) {
        const token = request.headers['x-token'];
        console.log(token);
        if (!token) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
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

        response.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.last,
            bio: user.bio,
            profile_picture: user.profile_picture,
            follows_count: user.followers_count,
            followers_count: user.followers_count,
        });
    }

    /**
     *
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    static async updateInfos(request, response) {
        const email = request.body ? request.body.email : null;
        const password = request.body ? request.body.password : null;
        const firstName = request.body ? request.body.firstName : null;
        const lastName = request.body ? request.body.lastName : null;
        const username = request.body ? request.body.username : null;
        const bio = request.body ? request.body.bio : null;
        const profile_picture = request.body ? request.body.username : null;

        const token = request.headers['x-token'];
        console.log(token);
        if (!token) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
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
        await User.update(
            {
                username,
                email,
                firstName,
                lastName,
                password,
                bio,
                profile_picture,
            },
            {
                where: {
                    id: userId,
                },
            },
        );
        response.status(200).json({
            userId,
            username,
            email,
            firstName,
            lastName,
            bio,
        });

    }

    static async getAllRegisteredEvents(req, res) {
        const { user_id } = req.params
        
        try {
            const registeredEvents = await User.findAll({
                where: {
                    id: user_id
                },
                include: [
                    {
                        model: Event,
                        as: 'RegisteredEvents',
                        through: { attributes: [] }
                    },
                ]
            })

            const events = registeredEvents.map(registration => registration.RegisteredEvents).flat()

            res.json({events})
            // res.json(registeredEvents)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports =  UsersController;