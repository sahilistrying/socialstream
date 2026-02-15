require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not defined in .env');
  process.exit(1);
}

const heroUser = {
  username: 'safiullah',
  email: 'safiullah@cvr.ac.in',
  password: 'SecurePass123!',
  fullName: 'Safiullah',
  bio: 'CS Student @ CVR • Full-stack dev • Competitive programmer',
  profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=safiullah',
  githubHandle: 'safiullah',
  leetcodeHandle: 'safiullah',
  codeforcesHandle: 'safiullah',
  auraPoints: 4203,
  rankTitle: 'Code Ninja',
  stats: {
    leetcode: {
      easy: 180,
      medium: 95,
      hard: 50,
      ranking: 42156,
    },
    codeforces: {
      rating: 1520,
      maxRating: 1650,
      rank: 'Master',
    },
    github: {
      totalCommits: 842,
      stars: 127,
      followers: 89,
    },
  },
  currentStreak: 12,
  lastActiveDate: new Date(),
  achievements: [
    { title: 'First Blood', dateEarned: new Date('2024-01-15'), icon: 'trophy' },
    { title: 'LeetCode Century', dateEarned: new Date('2024-03-20'), icon: 'code' },
    { title: 'Streak Master', dateEarned: new Date('2024-05-01'), icon: 'flame' },
    { title: 'Codeforces Expert', dateEarned: new Date('2024-06-12'), icon: 'trending-up' },
    { title: 'Open Source Hero', dateEarned: new Date('2024-07-08'), icon: 'github' },
    { title: 'Algorithm God', dateEarned: new Date('2024-08-22'), icon: 'crown' },
  ],
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');

    const existing = await User.findOne({ username: heroUser.username });
    if (existing) {
      await User.deleteOne({ username: heroUser.username });
      console.log('Removed existing hero user for fresh seed');
    }

    const user = await User.create(heroUser);
    console.log('Hero user created:', user.username);
    console.log('  - Aura:', user.auraPoints);
    console.log('  - Rank:', user.rankTitle);
    console.log('  - Streak:', user.currentStreak);
    console.log('  - LeetCode:', `${user.stats.leetcode.easy}+${user.stats.leetcode.medium}+${user.stats.leetcode.hard}`);
    console.log('  - Codeforces:', `${user.stats.codeforces.rating} (${user.stats.codeforces.rank})`);
    console.log('  - GitHub:', `${user.stats.github.totalCommits} commits, ${user.stats.github.stars} stars`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected. Seed complete.');
  }
}

seed();
