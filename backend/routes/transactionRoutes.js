const express = require('express');
const router = express.Router();
const multer = require('multer');
// multer handles file uploads (receipt images)

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');

// ── Multer Setup for Receipt Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
    // Temporarily save file to uploads folder
    // Then we upload to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
    // Give unique filename using timestamp
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  // Max file size 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      // Accept only image files
    } else {
      cb(new Error('Only image files allowed!'), false);
    }
  }
});

// ── All routes are protected (need token)
router.use(protect);
// This applies protect middleware to ALL routes below
// So we don't need to add protect to each route

// Summary route must come BEFORE /:id routes
// Otherwise Express thinks 'summary' is an ID!
router.get('/summary', getSummary);

router.route('/')
  .get(getTransactions)
  // GET /api/transactions → get all transactions
  .post(upload.single('receipt'), addTransaction);
  // POST /api/transactions → add new transaction
  // upload.single('receipt') handles one image upload

router.route('/:id')
  .put(updateTransaction)
  // PUT /api/transactions/:id → update transaction
  .delete(deleteTransaction);
  // DELETE /api/transactions/:id → delete transaction

module.exports = router;