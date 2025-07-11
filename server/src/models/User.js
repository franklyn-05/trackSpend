const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNum: Number,
    fname: String,
    sname: String,
    plaidToken: String,
    plaidItemId: String,
    created: {type: Date, default: Date.now }
}, { timestamps: true});

userSchema.pre('save', async function(next) {
    try {
        if(!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        res.status(500).json({ error: "Hashing error occured" })
    }

})
module.exports = mongoose.model('User', userSchema);