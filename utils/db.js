import User from "sequelize/types/model";

const { sequelize } = require('../config/db')

/**
 * setup client db utility
 */
class DBClient {
    async nbUsers() {
    }

    /**
     * returns the numbers of docs in the collections files
     * @returns {integer}
     */
    async nbEvents() {
    }

    /**
     * Retrieves a reference to the `users` collection.
     * @returns {Promise<Collection>}
     */
    usersAll() {
        sequelize.sync().then(() => {

            User.findAll().then(res => {
                console.log(res)
            }).catch((error) => {
                console.error('Failed to retrieve data : ', error);
            });

        }).catch((error) => {
            console.error('Unable to create table : ', error);
        });
    }

    /**
     * Retrieves a reference to the `events`.
     * @returns {Promise<Collection>}
     */
    async allEvents() {
    }
}
const dbClient = new DBClient();
module.exports = dbClient;
