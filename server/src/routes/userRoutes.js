const express = require('express');
const router = express.Router();

const {
    getUser,
    getUsers,
} = require('../controllers/userController');

router.get('/:email', getUser);
router.get('/', getUsers);

module.exports = router;