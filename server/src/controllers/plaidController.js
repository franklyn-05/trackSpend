const User = require('../models/User');
const Transaction = require('../models/Transaction');
const client = require('../services/plaidClient');

const createLinkToken = async (req, res) => {
    try{
        const tokenResponse = await client.linkTokenCreate({
            user: {client_user_id: req.user.userId},
            client_name: 'TrackSpend',
            products: ['transactions'],
            country_codes: ['GB'],
            redirect_uri: 'http://localhost:8000/',
            language: 'en'
            
        });
        res.json({ link_token: tokenResponse.data.link_token });
    } catch (err) {
        res.status(500).json({
            error: 'Error occured creating link token',
            details: err.response?.data || err.message
        });
    }

};

const exchangeToken = async (req, res) => {
    const { public_token, userId } = req.body;
    const response = await client.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;
    
    await User.findByIdAndUpdate(userId, { plaidToken: accessToken });
    res.json({ message: 'Token stored successfully' });
};

const fetchTransactions = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const accessToken = user.plaidToken;
        const now = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];

        const response = await client.transactionsGet({
            access_token: accessToken,
            start_date: thirtyDaysAgo,
            end_date: now,
        });

        const transactions = response.data.transactions;

        for (const t of transactions) {
            await Transaction.create({
                userId: req.user.id,
                amount: t.amount,
                date: t.date,
                categories: t.category.join(', ')
            });
        }
        res.join({ message: 'Transaction saved' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

module.exports = {
    createLinkToken,
    exchangeToken,
    fetchTransactions
};