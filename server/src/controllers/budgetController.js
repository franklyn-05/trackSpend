const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const getBudgets = async (req, res) => {
    try{
        const { userId } = req.user;
        const budgets = await Budget.find({ user:userId });
        let response = [];
        if (!budgets){
            res.status(404).json({ message: "No budgets found" });
        } else{
            for (const b of budgets) {
                const transactions = await Transaction.find({ user: userId }).where('date').gte(b.startDate).lte(b.endDate).where('category.primary').equals(b.category).exec();
                let total = 0;
                for (const t of transactions){
                    total += t.amount;
                };
                response.push({
                    budget: b,
                    spent: total
                });
        }

            
        }
        res.json(response)
    } catch (e) {
        console.error("Error occured: ", e);
    }
};

const createBudget = async (req, res) => {
    try{
        const { userId } = req.user;
        const { name, category, limit, start, end } = req.body;
        const transaction = await Budget.create({
            user: userId,
            name: name,
            category: category,
            limit: limit,
            startDate: start,
            endDate: end
        });
        res.status(201).json(transaction)
    } catch (e) {
        res.status(500).json({ error: "Error occured"})
    }
};

module.exports = {
    getBudgets,
    createBudget
};