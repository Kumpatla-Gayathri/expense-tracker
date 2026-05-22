const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
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
  targetAmount: {
    type: Number,
    required: true
  },
  savedAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: [
      'Emergency Fund', 'Vacation',
      'Education', 'Electronics',
      'Vehicle', 'Home', 'Other'
    ],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  },
  icon: {
    type: String,
    default: '🎯'
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);