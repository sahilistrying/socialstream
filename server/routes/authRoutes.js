const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with that email or username already exists' });
    }

    // Password will be hashed by the User model pre-save hook
    const user = await User.create({
      username,
      email,
      password,
      auraPoints: 0,
    });

    const token = generateToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Error in register:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;

