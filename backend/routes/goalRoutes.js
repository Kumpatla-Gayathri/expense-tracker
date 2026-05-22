const express = require('express');
const router = express.Router();

const {
  createGoal,
  getGoals,
  updateGoal,
  depositToGoal,
  deleteGoal
} = require('../controllers/goalController');
// Import all goal functions

const { protect } = require('../middleware/authMiddleware');

// ── All routes are protected (need token)
router.use(protect);
// Every goal route requires login

router.route('/')
  .get(getGoals)
  // GET /api/goals → get all goals
  .post(createGoal);
  // POST /api/goals → create new goal

router.route('/:id')
  .put(updateGoal)
  // PUT /api/goals/:id → update goal
  .delete(deleteGoal);
  // DELETE /api/goals/:id → delete goal

router.put('/:id/deposit', depositToGoal);
// PUT /api/goals/:id/deposit → add money to goal

module.exports = router;