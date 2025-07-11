const express = require('express');
const validateToken = require('../middleware/auth');
const router = express.Router();

const {
    getTransactions,
    createTransaction,
    getTransaction,
} = require('../controllers/transactionController');

router.get('/', validateToken, getTransactions);
router.get('/:userId', validateToken, getTransaction);
router.put('/', validateToken, createTransaction);

module.exports = router;