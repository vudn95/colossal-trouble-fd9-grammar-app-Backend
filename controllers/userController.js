const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        }, process.env.YOUR_SECRET_KEY, { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};

const addUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ username: email, email, password: hashedPassword, role });

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error Server' });
    }
}

const authorize = (roles=["user"]) => (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No access token' });
    try {
        const decoded = jwt.verify(token, process.env.YOUR_SECRET_KEY);
        if (!roles.includes(decoded.role)) return res.status(401).json({ message: "You don't have permmissons to access this route" });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
}

module.exports = { loginUser, addUser, authorize };