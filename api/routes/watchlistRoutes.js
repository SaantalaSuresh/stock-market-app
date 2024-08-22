import express from 'express';
import Watchlist from '../models/Watchlist.model.js';

const router = express.Router();







router.post('/', async (req, res) => {
  try {
    const { userId, stock } = req.body;
    if (!userId || !stock || !stock.symbol || !stock.name) {
      return res.status(400).json({ success: false, message: 'Invalid data received' });
    }
    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, stocks: [stock] });
      await watchlist.save();
      return res.json({ success: true, message: 'Watchlist created successfully' });
    }
    const stockExists = watchlist.stocks.some((s) => s.symbol === stock.symbol);
    if (stockExists) {
      return res.json({ success: false, message: 'Stock already in watchlist' });
    }
    watchlist.stocks.push(stock);
    await watchlist.save();
    res.json({ success: true, message: 'Stock added to watchlist successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// router.get('/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const watchlist = await Watchlist.findOne({ userId });
//     if (!watchlist) {
//       return res.status(404).json({ message: 'Watchlist not found' });
//     }
//     res.json(watchlist.stocks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Received userId:', userId);

    const watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      console.log('Watchlist not found for userId:', userId);
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    console.log('Stocks found:', watchlist.stocks);
    res.json(watchlist.stocks);
  } catch (error) {
    console.error('Error fetching watchlist:', error.message);
    res.status(500).json({ error: error.message });
  }
});


router.put('/:stockId', async (req, res) => {
  try {
    const { userId, updatedStock } = req.body;
    const { stockId } = req.params;
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    const stockIndex = watchlist.stocks.findIndex((stock) => stock._id.toString() === stockId);
    if (stockIndex === -1) {
      return res.status(404).json({ message: 'Stock not found in watchlist' });
    }
    watchlist.stocks[stockIndex] = { ...watchlist.stocks[stockIndex], ...updatedStock };
    await watchlist.save();
    res.json({ success: true, message: 'Stock updated successfully', updatedStock: watchlist.stocks[stockIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { userId, stockId } = req.body;
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    watchlist.stocks = watchlist.stocks.filter((stock) => stock._id.toString() !== stockId);
    await watchlist.save();
    res.json({ success: true, message: 'Stock removed from watchlist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;





