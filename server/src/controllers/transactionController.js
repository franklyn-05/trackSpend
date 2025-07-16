const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (e){
        res.status(500).json({ error: 'Failed to create transaction'});
    }

};

const getTransaction = async (req, res) => {
    try{
        const { userId } = req.params;
        const transaction = await Transaction.findById(userId);

        if (!userId) {
            return res.status(404).json({ error: 'Transaction not found'});
        }
        return res.json(transaction);
    } catch (e){
        res.status(500).json({ error: 'Error occured'});
    }
};

const getTransactions = async (req, res) => {
    const transactions = await Transaction.find();
    if (transactions){
        return res.json(transactions);
    } else {
        return res.status(404).json({ error: 'No transactions found'});
    }
};

module.exports = {
    createTransaction,
    getTransaction,
    getTransactions
};