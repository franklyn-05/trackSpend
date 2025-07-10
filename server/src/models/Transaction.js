const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    id: mongoose.Schema.Types.UUID,
    amount: Number,
    date: Date,
    categories: [{type: 'String'}]
});

module.exports = mongoose.model('Transaction', transactionSchema);