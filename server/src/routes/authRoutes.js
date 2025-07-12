const express = require('express');
const router = express.Router();

const {
    userLogin,
    register,
    profile
} = require('../controllers/authController');

const {
    loginRules,
    registerRules,
    validateUser
} = require('../middleware/validation');

const { validateToken } = require('../middleware/auth');

router.post('/login', loginRules, validateUser, userLogin);
router.post('/register', registerRules, validateUser, register);
router.get('/profile', validateToken, profile);


module.exports = router;