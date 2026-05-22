const express = require('express');
const router = express.Router();
const { getAITips } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Protected route — need to be logged in
router.post('/tips', protect, getAITips);

module.exports = router;