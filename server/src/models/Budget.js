const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectID, ref:'User'},
    name: String,
    category: String,
    limit: Number,
    startDate: Date,
    endDate: Date,
    frequency: String,
    recurring: String
});

module.exports = mongoose.model('Budget', budgetSchema);