const express = require('express');
const { loginUser, addUser, verifyAdmin } = require('../controllers/userController.js');

const router = express.Router();

router.post('/login', loginUser);
router.post('/add-user', verifyAdmin, addUser);

module.exports = router;
