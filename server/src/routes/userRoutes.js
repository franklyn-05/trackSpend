const express = require('express');
const router = express.Router();

const {
    getUser,
    addUser
} = require('../controllers/userController');

router.get('/', getUser);
router.post('/', addUser);

module.exports = router;