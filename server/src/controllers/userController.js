const User = require('../models/User');

const getUsers = async (req, res) => {
    const users = await User.find();
    if (users) {
        res.json(users);
    } else {
        res.status(404).json({ error: 'No users found'});
    }
}


module.exports = {
    getUsers,
};