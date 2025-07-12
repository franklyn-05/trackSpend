const User = require('../models/User');
const bcrypt = require('bcrypt');


const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    const hashedPassword  = user.password;

    bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error occured' });
        } 
        if (result) {
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                {  expiresIn: process.env.JWT_EXPIRES_IN }
            );
            return res.status(200).json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    email: email
                }
             });
        } else {
            return res.status(401).json({ error: 'Invalid login details' });
        }
    });
};

const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (e){
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const profile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } else {
            res.json(user);
        }
    } catch (err){
        res.status(500).json({ error: "Error occured" })
    }
}

module.exports = {
    userLogin,
    register,
    profile
}