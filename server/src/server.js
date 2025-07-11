const express = require('express');
const cors = require('cors');
const connectDB = require('./db')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require("./routes/authRoutes");
const dotenv = require('dotenv');

const server = express();
server.use(cors());
server.use(bodyParser.json());
dotenv.config();
connectDB();

server.post("/hello", (req, res) => {
    res.json({message: "Hello " + req.body.name});
});

server.use('/server/users', userRoutes);
server.use('/server/transactions', transactionRoutes);
server.use('/server/auth', authRoutes)

server.listen(8000, () => {
    console.log("Server is active");
});