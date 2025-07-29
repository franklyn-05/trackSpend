const User = require('../models/User');
const Transaction = require('../models/Transaction');
const client = require('../services/plaidClient');
const { createTransaction } = require('../controllers/transactionController');

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
    const { public_token } = req.body;
    const { userId } = req.user;
    const response = await client.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    await User.findByIdAndUpdate(userId, { plaidToken: accessToken, plaidItemId: itemId });
    res.json({ message: 'Token stored successfully' });
};

const disconnectBank = async (req, res) => {
    try{
        const user = await User.findById(req.user.userId);
        const accessToken = user.plaidToken;
        await client.itemRemove({access_token: accessToken});

        user.plaidToken = null;
        user.plaidItemId = null;
        user.plaidCursor = null;
        await user.save();
        
        res.json({ message: "Bank disconnected" });
    } catch(e) {
        console.error(e);
        res.status(500).json({ error: "Failed to disconnect bank"});
    }
}

const fetchTransactions = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId);
        const accessToken = user.plaidToken;
        const cursor = user.plaidCursor || null;
        const hasMore = true;

        while(hasMore) {
            const response = await client.transactionsSync({
                access_token: accessToken,
                cursor: cursor,
                count: 100,
            });

            const { added, modified, removed, next_cursor, has_more } = response.data;
            await User.findByIdAndUpdate(userId, {plaidCursor: next_cursor});


            for (const t of added) {
                await createTransaction({
                    trId: t.transaction_id,
                    user: req.user.userId,
                    amount: t.amount,
                    date: t.date,
                    category: t.personal_finance_category.join(','),
                    currency: t.iso_currency_code,
                    name: t.name,
                    merchant: t.merchant_name
                });
            };
            
            for (const t of modified){
                const item = {
                    trId: t.transaction_id,
                    user: req.user.userId,
                    amount: t.amount,
                    date: t.date,
                    category: t.personal_finance_category.join(','),
                    currency: t.iso_currency_code,
                    name: t.name,
                    merchant: t.merchant_name
                };
                await Transaction.findByIdAndUpdate(item.id, item);
            };
            hasMore = has_more;
        };

        res.json({
            message: 'Transactions synced',
         });
    } catch (err) {
        res.status(500).json({ error: 'Failed to sync transactions' });
    }
};

module.exports = {
    createLinkToken,
    exchangeToken,
    disconnectBank,
    fetchTransactions
};