import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  datetime: { type: String, required: true }, // Store datetime as string
});

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stocks: [stockSchema],
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
