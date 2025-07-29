const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/auth');

const {
    createLinkToken,
    exchangeToken,
    disconnectBank,
    fetchTransactions
} = require('../controllers/plaidController');

router.post('/create-link-token', validateToken, createLinkToken);
router.post('/exchange-token',validateToken, exchangeToken);
router.get('/transactions', validateToken, fetchTransactions);
router.get('/disconnect', validateToken, disconnectBank);

module.exports = router;