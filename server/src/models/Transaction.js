const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    trId: mongoose.Schema.Types.UUID,
    amount: Number,
    date: Date,
    category: String,
    currency: String,
    name: String,
    merchant: String
});

module.exports = mongoose.model('Transaction', transactionSchema);