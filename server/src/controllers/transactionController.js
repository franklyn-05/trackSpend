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
    const { userId } = req.user;
    const pageNum = parseInt(req.query.page) || 1;
    const  limit = parseInt(req.query.limit) || 20;
    const skip = (pageNum - 1) * limit

    const total = await Transaction.countDocuments({ user: userId });
    const transactions = await Transaction.find({ user: userId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);


    if (transactions){
        return res.json({
            transactions,
            page: pageNum,
            pages: Math.ceil(total / limit),
            total: total

        });
    } else {
        return res.status(404).json({ error: 'No transactions found'});
    }
};

module.exports = {
    createTransaction,
    getTransaction,
    getTransactions
};