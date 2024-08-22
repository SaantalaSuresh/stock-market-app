import mongoose from 'mongoose';
// import Stock from './UStock.model.js'; // Ensure this path is correct

const userStockSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: 'Invalid ObjectId',
    },
  },
});

const UserStock = mongoose.model('UserStock', userStockSchema);

export default UserStock;
