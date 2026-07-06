const express = require('express');

const { deleteMe, login, register } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validateAuthRequest = require('../middleware/validateAuthRequest');

const router = express.Router();

router.post('/register', validateAuthRequest, register);
router.post('/login', validateAuthRequest, login);
router.delete('/me', authenticate, deleteMe);

module.exports = router;
