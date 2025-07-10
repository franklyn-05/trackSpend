const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNum: Number,
    fname: String,
    sname: String,
    plaidToken: String,
    plaidItemId: String,
}, { timestamps: true});

module.exports = mongoose.model('User', userSchema);