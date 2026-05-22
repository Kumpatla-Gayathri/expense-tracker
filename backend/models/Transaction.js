const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'Food', 'Transport', 'Shopping',
      'Entertainment', 'Health', 'Education',
      'Rent', 'Salary', 'Freelance', 'Other'
    ],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  receipt: {
    url: { type: String },
    publicId: { type: String }
  },
  isRecurring: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);