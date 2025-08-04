const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    trId: {type: String, unique: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    accountId: String,
    amount: Number,
    date: Date,
    category: {
        primary: String,
        detailed: String
    },
    currency: String,
    name: String,
    merchant: String
});

module.exports = mongoose.model('Transaction', transactionSchema);