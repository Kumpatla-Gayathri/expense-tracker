
const Transaction = require('../models/Transaction');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── Add New Transaction
// Route: POST /api/transactions
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, description, date, isRecurring } = req.body;

    // Handle receipt image upload if provided
    let receipt = {};
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'expense-tracker/receipts'
        // Stores in this folder in Cloudinary
      });
      receipt = {
        url: result.secure_url,
        // Secure URL to access the image
        publicId: result.public_id
        // ID to delete image later if needed
      };
    }

    // Create transaction in database
    const transaction = await Transaction.create({
      user: req.user.id,
      // req.user.id comes from authMiddleware
      title,
      amount,
      type,
      category,
      description,
      date: date || Date.now(),
      receipt,
      isRecurring: isRecurring || false
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get All Transactions
// Route: GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    // Get filter options from query params
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build filter object
    let filter = { user: req.user.id };
    // Only get transactions for logged in user

    if (type) filter.type = type;
    // Filter by income or expense

    if (category) filter.category = category;
    // Filter by category

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        // $gte = greater than or equal to
        $lte: new Date(endDate)
        // $lte = less than or equal to
      };
    }

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    // Get transactions with pagination
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      // Sort by date — newest first
      .skip((page - 1) * limit)
      // Skip previous pages
      .limit(Number(limit));
      // Limit results per page

    res.json({
      transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Transaction
// Route: PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    // req.params.id = ID from URL

    if (!transaction) {
      return res.status(404).json({ message: '❌ Transaction not found!' });
    }

    // Make sure user owns this transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: '❌ Not authorized!' });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
      // new: true returns updated document
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete Transaction
// Route: DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: '❌ Transaction not found!' });
    }

    // Make sure user owns this transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: '❌ Not authorized!' });
    }

    // Delete receipt from Cloudinary if exists
    if (transaction.receipt && transaction.receipt.publicId) {
      await cloudinary.uploader.destroy(transaction.receipt.publicId);
      // Removes image from Cloudinary storage
    }

    await transaction.deleteOne();
    res.json({ message: '✅ Transaction deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Spending Summary
// Route: GET /api/transactions/summary
const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    // reduce adds up all amounts

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Category wise breakdown
    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    // Groups expenses by category

    // Monthly breakdown
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', {
        month: 'short', year: 'numeric'
      });
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      acc[month][t.type] += t.amount;
      return acc;
    }, {});

    // Calculate Spending Report Card Grade
    const savingsRate = totalIncome > 0
      ? ((balance / totalIncome) * 100)
      : 0;

    let grade, message;
    if (savingsRate >= 30) {
      grade = 'A';
      message = '🌟 Excellent! You are saving really well!';
    } else if (savingsRate >= 20) {
      grade = 'B';
      message = '👍 Good job! Try to save a little more!';
    } else if (savingsRate >= 10) {
      grade = 'C';
      message = '⚠️ Average. Watch your spending!';
    } else if (savingsRate >= 0) {
      grade = 'D';
      message = '❌ Poor. You need to cut expenses!';
    } else {
      grade = 'F';
      message = '🚨 Critical! You are spending more than you earn!';
    }

    res.json({
      totalIncome,
      totalExpense,
      balance,
      categoryBreakdown,
      monthlyData,
      reportCard: { grade, message, savingsRate: savingsRate.toFixed(1) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary
};