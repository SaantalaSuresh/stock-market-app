import express from 'express';
import UserStock from '../models/UserStock.model.js';


const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, stockId } = req.body;
    const userStock = new UserStock({ userId, stockId });
    await userStock.save();
    res.json({ message: "Stock added to user's portfolio successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userStocks = await UserStock.find({ userId }).populate('stockId');
    res.json(userStocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
