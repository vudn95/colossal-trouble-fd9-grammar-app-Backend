const express = require('express');
const { checkForGrammaticalErrors } = require('../controllers/grammarController.js');
const { authorize } = require('../controllers/userController.js');

const router = express.Router();

router.post('/check-grammar', authorize(["admin", "dev", "user"]), checkForGrammaticalErrors);

module.exports = router;
