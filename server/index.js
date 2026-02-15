require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
