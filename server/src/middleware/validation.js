const { body, validationResult } = require('express-validator');
const User = require('../models/User');


const registerRules = [
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .custom(async value => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email already in use');
            }
        }),
    body('password')
        .notEmpty()
        .isLength({ min: 8}).withMessage('Password must be at least 8 characters'),
    body('fname')
        .notEmpty().withMessage("First name required"),
    body('phoneNum')
        .isNumeric().withMessage("Must be a valid number")
]

const loginRules = [
    body('email')
        .notEmpty()
        .isEmail()
        .withMessage('Valid email required'),
    body('password')
        .notEmpty()
        .withMessage('Password required')
]

const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerRules,
    loginRules,
    validateUser
};