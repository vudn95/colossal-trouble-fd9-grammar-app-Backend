const express = require("express");
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require("./config/db");
const userRouters = require('./routers/userRouters');
const grammarRouters = require('./routers/grammarRouters');

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

sequelize.sync({ force: false, alter: true })
    .then(() => console.log("All models synchronized"))
    .catch(err => console.log("Error syncing models: ", err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});