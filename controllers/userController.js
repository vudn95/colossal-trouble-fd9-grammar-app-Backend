const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { isAdmin } = require('../utils/helper');

dotenv.config();

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (isAdmin(email, password)) {
            const token = jwt.sign({
                id: -1,
                username: process.env.ADMIN_USER_NAME,
                email: process.env.ADMIN_USER_NAME,
                is_admin: true
            }, process.env.YOUR_SECRET_KEY, { expiresIn: '1d' });
            return res.status(200).json({
                token,
                user: {
                    id: -1,
                    username: process.env.ADMIN_USER_NAME,
                    email: process.env.ADMIN_USER_NAME,
                    is_admin: true
                }
            });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            is_admin: false,
        }, process.env.YOUR_SECRET_KEY, { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                is_admin: false,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error server' });
    }
};

const addUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ username: email, email, password: hashedPassword });

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error Server' });
    }
}

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No access token' });

    try {
        const decoded = jwt.verify(token, process.env.YOUR_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

const verifyAdmin = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No access token' });

    try {
        const decoded = jwt.verify(token, process.env.YOUR_SECRET_KEY);
        if (!decoded.is_admin) return res.status(401).json({ message: 'You are not an admin' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
}

module.exports = { loginUser, addUser, verifyToken, verifyAdmin };