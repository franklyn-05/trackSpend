const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access Denied" });
    try{
        const verif = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verif;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = {
    validateToken
};