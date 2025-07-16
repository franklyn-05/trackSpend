require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require("./routes/authRoutes");
const plaidRoutes = require('./routes/plaidRoutes');

const server = express();
server.use(cors());
server.use(bodyParser.json());
connectDB();

server.post("/hello", (req, res) => {
    res.json({message: "Hello " + req.body.name});
});

server.use('/api/users', userRoutes);
server.use('/api/transactions', transactionRoutes);
server.use('/api/auth', authRoutes);
server.use('/api/plaid', plaidRoutes);

server.listen(8000, () => {
    console.log("Server is active");
});