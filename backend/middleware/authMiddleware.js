const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in request headers
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {

      // Extract token from "Bearer xxxxx"
      token = req.headers.authorization.split(' ')[1];

      // Verify token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from token and attach to request
      // .select('-password') means don't include password
      req.user = await User.findById(decoded.id).select('-password');

      // Move to next function
      next();

    } else {
      res.status(401).json({ message: '❌ Not authorized — no token!' });
    }
  } catch (error) {
    res.status(401).json({ message: '❌ Token is invalid or expired!' });
  }
};

module.exports = { protect };