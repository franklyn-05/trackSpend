const plaid = require('plaid');

const client = new plaid.PlaidApi({
    clientID: process.env.PLAID_CLIENT,
    secret: process.env.PLAID_SECRET,
    env: plaid.PlaidEnvironments[process.env.PLAID_ENV]
})

module.exports = client;