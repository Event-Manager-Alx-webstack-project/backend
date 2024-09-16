const { connectDB } = require('./config/db');
const { sequelize } = require('./models')

const app = require('./app');

connectDB(sequelize);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App running on PORT ${PORT}`);
});