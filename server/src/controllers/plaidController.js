const User = require('../models/User');
const client = require('../services/plaidClient');

const createLinkToken = async (req, res) => {
    const tokenResponse = await client.linkTokenCreate({
        user: {client_user_id: req.body.user.id},
        client_name: 'TrackSpend',
        products: ['transactions'],
        country_codes: ['UK'],
        language: 'en'
    });
    res.json({ link_token: tokenResponse.data.link_token });
};

const exchangeToken = async (req, res) => {
    const { public_token, userId } = req.body;
    const response = await client.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;
    
    await User.findByIdAndUpdate(userId, { plaidAccessToken: accessToken });
    res.json({ message: 'Token stored successfully' });
}

module.exports = {
    createLinkToken,
    exchangeToken
};