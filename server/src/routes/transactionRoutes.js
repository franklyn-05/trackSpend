const express = require('express');
const router = express.Router();
const { validateToken }= require('../middleware/auth');

const {
    getTransactions,
    createTransaction,
    getTransaction,
} = require('../controllers/transactionController');

router.get('/', validateToken, getTransactions);
router.get('/transaction', validateToken, getTransaction);
router.put('/', validateToken, createTransaction);

module.exports = router;