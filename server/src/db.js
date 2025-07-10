const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected!');
    } catch (err) {
        console.error('Connection failed to establish', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;