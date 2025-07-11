const User = require('../models/User');

const getUser = async (req, res) => {
    try{
        const { email } = req.params;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (e)  {
        res.status(500).json({ error: 'Server error' });
    }
};

const getUsers = async (req, res) => {
    const users = await User.find();
    if (users) {
        res.json(users);
    } else {
        res.status(404).json({ error: 'No users found'});
    }
}


module.exports = {
    getUser,
    getUsers,
};