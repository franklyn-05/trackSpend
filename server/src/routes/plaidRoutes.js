const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/auth');

const {
    createLinkToken,
    exchangeToken,
    fetchTransactions
} = require('../controllers/plaidController');

router.post('/create-link-token', validateToken, createLinkToken)
router.post('/exchange-token',validateToken, exchangeToken)
router.get('/transactions', validateToken, fetchTransactions)

module.exports = router;