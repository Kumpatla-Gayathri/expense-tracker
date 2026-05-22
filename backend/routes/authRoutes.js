const express = require('express');
const router = express.Router();
// Router lets us define routes separately
// then plug them into main server.js

const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../controllers/authController');
// Import all three functions from authController

const { protect } = require('../middleware/authMiddleware');
// Import protect middleware for protected routes

// ── Public Routes (no token needed)
router.post('/register', registerUser);
// POST /api/auth/register → registerUser function

router.post('/login', loginUser);
// POST /api/auth/login → loginUser function

// ── Protected Routes (token required)
router.get('/profile', protect, getUserProfile);
// GET /api/auth/profile → first runs protect middleware
// then runs getUserProfile function
// protect acts as a guard between route and controller

module.exports = router;