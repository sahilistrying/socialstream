require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (for dev; restrict in production)
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SocialStream Backend is pumping!' });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Google auth routes
const googleAuthRoutes = require('./routes/googleAuthRoutes');
app.use('/api/google', googleAuthRoutes);

app.post('/api/google/calendar', async (req, res) => {
  try {
    const { accessToken, contest } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: 'accessToken is required' });
    }
    if (!contest || !contest.name || !contest.start_time) {
      return res.status(400).json({ error: 'contest with name and start_time is required' });
    }
    const startIso = new Date(contest.start_time).toISOString();
    const endIso = contest.end_time
      ? new Date(contest.end_time).toISOString()
      : new Date(new Date(contest.start_time).getTime() + 60 * 60 * 1000).toISOString();
    const payload = {
      summary: contest.name,
      location: contest.url || '',
      start: { dateTime: startIso, timeZone: 'UTC' },
      end: { dateTime: endIso, timeZone: 'UTC' },
    };
    await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(201).json({ status: 'ok' });
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('Google Calendar API error:', detail);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

// Post routes
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
