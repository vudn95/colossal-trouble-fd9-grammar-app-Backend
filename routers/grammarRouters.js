const express = require('express');
const { checkForGrammaticalErrors } = require('../controllers/grammarController.js');
const { verifyToken } = require('../controllers/userController.js');

const router = express.Router();

router.post('/check-grammar', verifyToken, checkForGrammaticalErrors);

module.exports = router;
