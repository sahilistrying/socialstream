const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      college: user.college || '',
      onboardingComplete: !!user.onboardingComplete,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

// POST /api/google/auth
// Verifies a Google OAuth access token and finds/creates a matching user in MongoDB.
router.post('/auth', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Google access token is required' });
    }

    if (!GOOGLE_CLIENT_ID) {
      return res
        .status(500)
        .json({ error: 'GOOGLE_CLIENT_ID is not configured on the server' });
    }

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

    // Validate the access token and get basic profile data.
    // This does not require a refresh token or client secret for verification.
    const tokenInfo = await client.getTokenInfo(accessToken);

    const googleUserId = tokenInfo.sub;
    const email = tokenInfo.email;

    if (!email) {
      return res.status(400).json({ error: 'Google token is missing email information' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user based on Google identity.
      // A random password is set because the schema requires it, but it is not used for Google logins.
      const randomPassword = Math.random().toString(36).slice(-12);

      user = await User.create({
        username: email.split('@')[0],
        email,
        password: randomPassword,
        fullName: tokenInfo.name || '',
      });
    }

    const token = generateToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      token,
      user: safeUser,
      googleUserId,
    });
  } catch (err) {
    console.error('Error in Google auth:', err.message);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
});

module.exports = router;

