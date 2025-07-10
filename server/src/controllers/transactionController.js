const Transaction = require('../models/Transaction');

const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (e){
        res.status(500).json({ error: 'Failed to create transaction'})
    }

};

const getTransaction = async (req, res) => {
    try{
        const { id } = req.params;
        const transaction = await Transaction.findById(id);

        if (!id) {
            res.status(404).json({ error: 'Transaction not found'});
        }
        res.json(transaction);
    } catch (e){
        res.status(500).json({ error: 'Error occured'})
    }

}

const getTransactions = async (req, res) => {
    const transactions = await Transaction.find();
    if (transactions){
        res.json(transactions);
    } else {
        res.status(404).json({ error: 'No transactions found'});
    }
};

module.exports = {
    createTransaction,
    getTransaction,
    getTransactions
}