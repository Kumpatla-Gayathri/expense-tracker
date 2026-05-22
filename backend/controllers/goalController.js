const Goal = require('../models/Goal');

// ── Create New Goal
// Route: POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, category, icon, notes } = req.body;

    const goal = await Goal.create({
      user: req.user.id,
      // Links goal to logged in user
      title,
      targetAmount,
      deadline,
      category: category || 'Other',
      icon: icon || '🎯',
      notes
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get All Goals
// Route: GET /api/goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    // Sort by newest first

    // Add progress percentage to each goal
    const goalsWithProgress = goals.map(goal => ({
      ...goal.toObject(),
      // Convert mongoose document to plain object
      progressPercentage: Math.min(
        Math.round((goal.savedAmount / goal.targetAmount) * 100),
        100
      ),
      remainingAmount: Math.max(goal.targetAmount - goal.savedAmount, 0),
      // How much more needed to reach goal
      daysLeft: Math.ceil(
        (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
      )
      // How many days left until deadline
    }));

    res.json(goalsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Goal Progress
// Route: PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: '❌ Goal not found!' });
    }

    // Make sure user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: '❌ Not authorized!' });
    }

    // Update goal with new data
    const updated = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
      // runValidators = run schema validations on update
    );

    res.json({
      ...updated.toObject(),
      progressPercentage: Math.min(
        Math.round((updated.savedAmount / updated.targetAmount) * 100),
        100
      ),
      remainingAmount: Math.max(updated.targetAmount - updated.savedAmount, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Add Money to Goal
// Route: PUT /api/goals/:id/deposit
const depositToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: '❌ Goal not found!' });
    }

    // Make sure user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: '❌ Not authorized!' });
    }

    // Add amount to saved amount
    goal.savedAmount += Number(amount);

    // Auto mark as completed if target reached
    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();

    res.json({
      ...goal.toObject(),
      progressPercentage: Math.min(
        Math.round((goal.savedAmount / goal.targetAmount) * 100),
        100
      ),
      remainingAmount: Math.max(goal.targetAmount - goal.savedAmount, 0),
      message: goal.status === 'completed'
        ? '🎉 Congratulations! Goal completed!'
        : `✅ ₹${amount} added to your goal!`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete Goal
// Route: DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: '❌ Goal not found!' });
    }

    // Make sure user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: '❌ Not authorized!' });
    }

    await goal.deleteOne();
    res.json({ message: '✅ Goal deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  depositToGoal,
  deleteGoal
};