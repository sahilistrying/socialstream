const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { updateUserAura } = require('../services/auraService');

// GET /api/users/leaderboard - Top users by Aura
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find(
      {},
      'username fullName profilePicture auraPoints rankTitle',
    )
      .sort({ auraPoints: -1 })
      .limit(50);

    res.json(users);
  } catch (err) {
    console.error('Error fetching leaderboard:', err.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/users/:username - Fetch user by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:username/refresh - Refresh Aura stats from external services
router.post('/:username/refresh', async (req, res) => {
  try {
    const { username } = req.params;
    const updatedUser = await updateUserAura(username);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error refreshing user aura:', err.message);
    res.status(500).json({ error: 'Failed to refresh user aura' });
  }
});

// PUT /api/users/:username - Update profile fields
router.put('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { bio, leetcodeHandle, codeforcesHandle, githubHandle, fullName } = req.body;

    const updateFields = {};
    if (typeof bio !== 'undefined') updateFields.bio = bio;
    if (typeof leetcodeHandle !== 'undefined') updateFields.leetcodeHandle = leetcodeHandle;
    if (typeof codeforcesHandle !== 'undefined') updateFields.codeforcesHandle = codeforcesHandle;
    if (typeof githubHandle !== 'undefined') updateFields.githubHandle = githubHandle;
    if (typeof fullName !== 'undefined') updateFields.fullName = fullName;

    const updatedUser = await User.findOneAndUpdate(
      { username }, // use exact casing from URL
      { $set: updateFields },
      { new: true },
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

