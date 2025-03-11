const express = require('express');
const { loginUser, addUser, authorize } = require('../controllers/userController.js');

const router = express.Router();

router.post('/login', loginUser);
router.post('/add-user', authorize(["admin"]), addUser);

module.exports = router;
