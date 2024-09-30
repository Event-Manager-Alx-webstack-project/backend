const Event = require('../models/event')
const { User, UserFollow } = require('../models')
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
        console.log('user registration');
        console.log(request.body);
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
        // response.setHeader("Access-Control-Allow-Origin", "*");
        // response.setHeader("Access-Control-Allow-Credentials", "true");
        // response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        // response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, " +
        //     "X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        const token = request.headers['authorization'];
        console.log(token);
        if (!token) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // const userId = await redisClient.get(`auth_${token}`);
        const userId = request.user.id;
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
    static async getAll(request, response) {
        let users;
        try {
            users = await User.findAll({ raw: true });
        } catch (e) {
            console.error(e);
        }
        if (!users) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }

        response.status(200).json({
            users
        });
    }
    /**
     *
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    static async getOrganizers(request, response) {
        let organizers;
        try {
            organizers = await Event.findAll({
                attributes: ['organizer_id'],
                include: {
                    model: User,
                    attributes: ['username', 'id'],
                }
                },);
        } catch (e) {
            console.error(e);
        }
        if (!organizers) {
            response.status(401).json({ error: 'not found' });
            return;
        }

        response.status(200).json({
            organizers
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

        const token = request.headers['authorization'];
        console.log(token);
        if (!token) {
            response.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // const userId = await redisClient.get(`auth_${token}`);
        const userId = request.user.id;
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
                password: sha1(password),
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
        const {user_id} = req.params

        try {
            const registeredEvents = await User.findAll({
                where: {
                    id: user_id
                },
                include: [
                    {
                        model: Event,
                        as: 'RegisteredEvents',
                        through: {attributes: []}
                    },
                ]
            })

            const events = registeredEvents.map(registration => registration.RegisteredEvents).flat()

            res.json({events})
            // res.json(registeredEvents)
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
    static async follow(req, res) {
        try {
            const { f_user_id } = req.params
            const { user_id } = req.body
            const existingLike = await UserFollow.findOne({
                where: { user_id, organizer_id: f_user_id }
            })

            if (existingLike) {
                return res.status(400).json({ message: 'Already Following' })
            }

            await UserFollow.create({ user_id, organizer_id: f_user_id }),
                // Event.update({ likes_count: { $inc: 1 } }, {
                //     where: {
                //         id: event_id
                //     }
                // })
                await User.increment('follows_count', {
                    where: {
                        id: user_id
                    }
                })
                await User.increment('followers_count', {
                    where: {
                        id: f_user_id
                    }
                })
            res.json({ message: 'User Followed!' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports =  UsersController;