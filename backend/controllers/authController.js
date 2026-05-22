
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  // Creates a token that expires in 30 days
  // Token contains the user's ID
};

// ── Register New User
// Route: POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Destructure name, email, password from request body

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: '❌ User already exists!' });
    }

    // Hash the password before saving
    // Never store plain text passwords!
    const salt = await bcrypt.genSalt(10);
    // genSalt(10) = generates random salt with 10 rounds
    // More rounds = more secure but slower

    const hashedPassword = await bcrypt.hash(password, salt);
    // Combines password + salt to create hash

    // Create new user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
        // Send back token so user is logged in immediately
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Login User
// Route: POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '❌ Invalid email or password!' });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Invalid email or password!' });
    }

    // Send back user data + token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get User Profile
// Route: GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user.id).select('-password');
    // .select('-password') = return everything EXCEPT password
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
// Export all three functions to use in routes