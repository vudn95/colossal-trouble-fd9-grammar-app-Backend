const express = require("express");
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require("./config/db");
const userRouters = require('./routers/userRouters');
const grammarRouters = require('./routers/grammarRouters');
const User = require("./models/UserModel");
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRouters);
app.use('/api/grammar', grammarRouters);

// Connect to PostgreSQL
connectDB();

const createAdminUser = async () => {
    const admin = await User.findOne({
        where: {
            email: process.env.ADMIN_USER_NAME,
        }
    });
    if (!admin) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await User.create({
            username: process.env.ADMIN_USER_NAME,
            email: process.env.ADMIN_USER_NAME,
            password: hashedPassword,
            role: "admin",
        });
        console.log("✅ Admin user created.");
    } else {
        console.log("🔹 Admin user already exists.");
    }
};

sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log("All models synchronized")
        createAdminUser();
    })
    .catch(err => console.log("Error syncing models: ", err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});