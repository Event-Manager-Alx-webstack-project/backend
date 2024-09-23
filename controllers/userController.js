const { User } = require('../models')
const bcrypt = require('bcrypt')

const signUp = async (req, res) => {
    try {
        const { username, email, password, is_organizer } = req.body
        const password_hash = await bcrypt.hash(password, 10)
        const user = await User.create({
            username,
            email,
            password_hash,
            is_organizer
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}