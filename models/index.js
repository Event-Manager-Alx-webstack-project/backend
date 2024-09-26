const { sequelize } = require('../config/db')
const User = require('./user')
const Category = require('./category')
const Comment = require('./comment')
const Event = require('./event')
const EventCategory = require('./eventCategory')
const UserBookmark = require('./userBookmark')
const UserCategory = require('./userCategory')
const UserFollow = require('./userFollow')
const UserLike = require('./userLike')
const UserShare = require('./userShare')
const UserEventRegistration = require('./userEventRegistration')

User.hasMany(Event, { foreignKey: 'organizer_id' })
Event.belongsTo(User, { foreignKey: 'organizer_id' })

Event.belongsToMany(Category, { through: EventCategory, foreignKey: 'event_id' })
Category.belongsToMany(Event, { through: EventCategory, foreignKey: 'category_id' })

User.belongsToMany(Event, { through: UserLike, as: 'LikedEvents', foreignKey: 'user_id' })
Event.belongsToMany(User, { through: UserLike, as: 'Likes', foreignKey: 'event_id' })

User.belongsToMany(Event, { through: UserShare, as: 'SharedEvents', foreignKey: 'user_id' })
Event.belongsToMany(User, { through: UserLike, as: 'Shares', foreignKey: 'event_id' })

User.belongsToMany(User, { through: UserFollow, as: 'FollowedOrganizers', foreignKey: 'user_id' })
User.belongsToMany(User, { through: UserFollow, as: 'Following', foreignKey: 'organizer_id' })

User.belongsToMany(Category, { through: UserCategory, as: 'UserInterests', foreignKey: 'user_id' })
Category.belongsToMany(User, { through: UserCategory, as: 'Users', foreignKey: 'category_id' })

User.belongsToMany(Event, { through: UserBookmark, as: 'BookmarkedEvents', foreignKey: 'user_id' })
Event.belongsToMany(User, { through: UserBookmark, as: 'Bookmarks', foreignKey: 'event_id' })

User.belongsToMany(Event, { through: UserEventRegistration, as: 'RegisteredEvents', foreignKey: 'user_id' })
Event.belongsToMany(User, { through: UserEventRegistration, as: 'Registrations', foreignKey: 'event_id' })

Event.hasMany(Comment, { foreignKey: 'event_id' })
Comment.belongsTo(Event, { foreignKey: 'event_id' })

User.hasMany(Comment, { foreignKey:  'user_id' })
Comment.belongsTo(User, { foreignKey: 'user_id' })

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database and table created')
    })

module.exports = {
    sequelize,
    User,
    Category,
    Comment,
    Event,
    EventCategory,
    UserBookmark,
    UserCategory,
    UserFollow,
    UserLike,
    UserShare,
    UserEventRegistration
}