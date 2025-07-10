const express = require('express');
const router = express.Router();

const {
    getTransactions,
    createTransaction,
} = require('../controllers/transactionController');

router.get('/', getTransactions);
router.put('/', createTransaction);

module.exports = router;