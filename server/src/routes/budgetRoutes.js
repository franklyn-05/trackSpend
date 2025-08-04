const express = require('express');
const router = express.Router();
const { validateToken }= require('../middleware/auth');

const {
    budgetRules,
    validateUser
} = require('../middleware/validation');

const {
    getBudgets,
    createBudget
} = require('../controllers/budgetController');

router.get('/', validateToken, getBudgets);
router.post('/', budgetRules, validateUser, validateToken, createBudget);

module.exports = router;