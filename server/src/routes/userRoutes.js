const express = require('express');
const router = express.Router();

const {
    getUser,
    addUser,
    getUsers,
} = require('../controllers/userController');

router.get('/:email', getUser);
router.get('/', getUsers);
router.post('/register', addUser);

module.exports = router;