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
        let cursor = user.plaidCursor || null;
        let hasMore = true;
        let added = [], modified = [], removed = [];

        while(hasMore) {
            const response = await client.transactionsSync({
                access_token: accessToken,
                cursor: cursor,
                count: 100,
            });
            
            const data = response.data;

            added = added.concat(data.added);
            modified = modified.concat(data.modified);
            removed = removed.concat(data.removed);

            cursor = data.next_cursor;
            hasMore = data.has_more;
            await User.findByIdAndUpdate(userId, {plaidCursor: data.next_cursor});

        };
        

        for (const t of added) {
            const exists = await Transaction.findOne({ trId:t.transaction_id });
            if (!exists){
                await Transaction.create({
                    trId: t.transaction_id,
                    user: userId,
                    accountId: t.account_id,
                    amount: t.amount,
                    date: t.date,
                    category: {
                        primary: t.personal_finance_category.primary || null,
                        detailed: t.personal_finance_category.detailed || null
                    },
                    currency: t.iso_currency_code,
                    name: t.name,
                    merchant: t.merchant_name
                });
            }
        };
        
        for (const t of modified){
            const item = {
                trId: t.transaction_id,
                user: userId,
                accountId: t.account_id,
                amount: t.amount,
                date: t.date,
                category: {
                    primary: t.personal_finance_category.primary || null,
                    detailed: t.personal_finance_category.detailed || null
                },
                currency: t.iso_currency_code,
                name: t.name,
                merchant: t.merchant_name
            };
            await Transaction.findOneAndUpdate({trId:item.trId}, item);
        };

        for (const t of removed){
            await Transaction.deleteOne({trId:t.trId})
        }

        res.status(200).json({
            message: 'Transactions synced',
        });
    } catch (err) {
        console.error("Transaciton sync error", err);
        res.status(500).json({ error: 'Failed to sync transactions' });
    }
};

const getBankInfo = async (req, res) => {
    try{
        const { userId } = req.user;
        const user = await User.findById(userId);
        const token = user.plaidToken;
        if (!user.plaidToken){
            return res.status(404).json({ error: "Bank info wasnt found"});
        }

        const accounts = await client.accountsGet({
            access_token: token
        });
        const itemResponse = await client.itemGet({
            access_token: token
        });
        const institution = await client.institutionsGetById({
            institution_id: itemResponse.data.item.institution_id,
            country_codes: ['GB']
        });
        res.json({
            institutionName: institution.data.institution.name,
            accounts: accounts.data.accounts
        })
    } catch (e) {
        console.error("Error occured:", e);
        res.status(500).json({ error: "Failed to fetch bank info" });
    }
};

module.exports = {
    createLinkToken,
    exchangeToken,
    disconnectBank,
    fetchTransactions,
    getBankInfo
};