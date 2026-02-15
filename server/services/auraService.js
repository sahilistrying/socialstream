const axios = require('axios');
const User = require('../models/User');

/**
 * Fetch LeetCode stats for a user.
 *
 * Uses the public GraphQL endpoint at https://leetcode.com/graphql.
 * Query returns the user's global ranking and accepted submission counts
 * per difficulty; we sum these to get totalSolved.
 */
async function fetchLeetCodeStats(handle) {
  if (!handle) {
    return {
      totalSolved: 0,
      ranking: 0,
      breakdown: { easy: 0, medium: 0, hard: 0 },
    };
  }

  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        profile {
          ranking
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query,
        variables: { username: handle },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const matchedUser = response.data?.data?.matchedUser;
    if (!matchedUser) {
      return {
        totalSolved: 0,
        ranking: 0,
        breakdown: { easy: 0, medium: 0, hard: 0 },
      };
    }

    const acSubmissionNum = matchedUser.submitStats?.acSubmissionNum || [];
    const breakdown = { easy: 0, medium: 0, hard: 0 };
    let totalSolved = 0;

    for (const entry of acSubmissionNum) {
      const count = entry?.count || 0;
      totalSolved += count;

      if (entry.difficulty === 'Easy') breakdown.easy = count;
      if (entry.difficulty === 'Medium') breakdown.medium = count;
      if (entry.difficulty === 'Hard') breakdown.hard = count;
    }

    const ranking = matchedUser.profile?.ranking ?? 0;

    return {
      totalSolved,
      ranking,
      breakdown,
    };
  } catch (err) {
    console.error('Error fetching LeetCode stats:', err.message);
    return {
      totalSolved: 0,
      ranking: 0,
      breakdown: { easy: 0, medium: 0, hard: 0 },
    };
  }
}

/**
 * Fetch Codeforces stats for a user.
 *
 * Uses https://codeforces.com/api/user.info?handles=HANDLE
 */
async function fetchCodeforcesStats(handle) {
  if (!handle) {
    return {
      rating: 0,
      maxRating: 0,
      rank: '',
    };
  }

  const url = `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`;

  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    if (data.status !== 'OK' || !Array.isArray(data.result) || data.result.length === 0) {
      return {
        rating: 0,
        maxRating: 0,
        rank: '',
      };
    }

    const user = data.result[0];
    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || '',
    };
  } catch (err) {
    console.error('Error fetching Codeforces stats:', err.message);
    return {
      rating: 0,
      maxRating: 0,
      rank: '',
    };
  }
}

/**
 * Fetch GitHub stats for a user.
 *
 * Uses https://api.github.com/users/HANDLE
 */
async function fetchGitHubStats(handle) {
  if (!handle) {
    return {
      repos: 0,
      followers: 0,
    };
  }

  const url = `https://api.github.com/users/${encodeURIComponent(handle)}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'socialstream-aura-service',
        Accept: 'application/vnd.github+json',
      },
      timeout: 8000,
    });

    return {
      repos: data.public_repos || 0,
      followers: data.followers || 0,
    };
  } catch (err) {
    console.error('Error fetching GitHub stats:', err.message);
    return {
      repos: 0,
      followers: 0,
    };
  }
}

/**
 * Update a user's Aura stats by fetching live data from
 * LeetCode, Codeforces, and GitHub.
 *
 * Aura formula:
 *   (LeetCodeSolved * 10) + (CodeforcesRating * 2) + (GitHubRepos * 50)
 */
async function updateUserAura(username) {
  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }

  const leetcodeHandle = user.leetcodeHandle || user.username;
  const codeforcesHandle = user.codeforcesHandle || user.username;
  const githubHandle = user.githubHandle || user.username;

  const [leetcode, codeforces, github] = await Promise.all([
    fetchLeetCodeStats(leetcodeHandle),
    fetchCodeforcesStats(codeforcesHandle),
    fetchGitHubStats(githubHandle),
  ]);

  const leetSolved = leetcode.totalSolved || 0;
  const cfRating = codeforces.rating || 0;
  const githubRepos = github.repos || 0;

  const newAura = leetSolved * 10 + cfRating * 2 + githubRepos * 50;

  const updatedUser = await User.findOneAndUpdate(
    { username },
    {
      $set: {
        auraPoints: newAura,
        'stats.leetcode.easy': leetcode.breakdown?.easy || 0,
        'stats.leetcode.medium': leetcode.breakdown?.medium || 0,
        'stats.leetcode.hard': leetcode.breakdown?.hard || 0,
        'stats.leetcode.ranking': leetcode.ranking || 0,
        'stats.codeforces.rating': codeforces.rating || 0,
        'stats.codeforces.maxRating': codeforces.maxRating || 0,
        'stats.codeforces.rank': codeforces.rank || '',
        // We only have basic GitHub user stats here; store what we can.
        'stats.github.followers': github.followers || 0,
      },
      $setOnInsert: {
        // no-op for existing users, but keeps structure explicit
      },
    },
    { new: true },
  ).select('-password');

  return updatedUser;
}

module.exports = {
  fetchLeetCodeStats,
  fetchCodeforcesStats,
  fetchGitHubStats,
  updateUserAura,
};

