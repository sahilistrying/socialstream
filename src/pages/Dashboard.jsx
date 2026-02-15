import React, { useState, useEffect } from 'react';
import api from '../api.js';
import { Bell, MessageSquareMore, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import Feed from '../components/Feed.jsx';
import RightSidebar from '../components/RightSidebar.jsx';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [username, setUsername] = useState(null);

  // Read current user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('socialstream_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.username) {
          setUsername(parsed.username);
        }
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  // Fetch profile for the current username
  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        // FIX 1: Use the 'username' variable, NOT Safiullah
        const response = await api.get(`/users/${username}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]);

  const handleRefreshAura = async () => {
    if (!username) return;

    try {
      setIsRefreshing(true);
      // FIX 2: Use the 'username' variable here too
      const response = await api.post(`/users/${username}/refresh`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error refreshing Aura:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Loading state
  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linkedinBg">
        <p className="text-lg font-medium text-slate-600">
          {username ? 'Loading SocialStream...' : 'Please log in to view your dashboard.'}
        </p>
      </div>
    );
  }

  // Map API data to component props
  const userProps = {
    username: userData.username,
    name: userData.fullName || userData.username,
    headline: userData.bio || 'CS Student @ CVR',
    avatarInitial: (userData.fullName || userData.username)[0].toUpperCase(),
    profilePicture: userData.profilePicture,
    bio: userData.bio || '',
    leetcodeHandle: userData.leetcodeHandle || '',
    codeforcesHandle: userData.codeforcesHandle || '',
    githubHandle: userData.githubHandle || '',
    fullName: userData.fullName || '',
  };

  const level = Math.max(1, Math.floor((userData.auraPoints || 0) / 1000) + 1);
  const currentLevelStartPoints = (level - 1) * 1000;
  const nextLevelStartPoints = level * 1000;
  const progress = Math.min(
    100,
    Math.round((((userData.auraPoints || 0) - currentLevelStartPoints) / (nextLevelStartPoints - currentLevelStartPoints)) * 100),
  );

  const auraProps = {
    totalAura: userData.auraPoints || 0,
    level: level,
    progress: progress,
    rankTitle: userData.rankTitle || 'Novice',
    globalRank: userData.stats?.leetcode?.ranking || 0,
    streak: userData.currentStreak || 0,
    quest: "Today's Quest", 
  };

  return (
    <div className="min-h-screen bg-linkedinBg text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-linkedinBlue via-sky-500 to-indigo-500 text-white font-semibold shadow-md">
              SS
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-slate-900">
                SocialStream
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Dev Network
              </div>
            </div>
          </div>

          <div className="hidden flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-500 md:flex">
            <Search size={16} className="text-slate-400" />
            <input
              className="h-6 w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400"
              placeholder="Search developers, topics, or quests..."
            />
          </div>

          <div className="ml-auto flex items-center gap-3 text-slate-500">
            <button className="rounded-full border border-slate-200 bg-white p-2 shadow-sm hover:border-linkedinBlue/40 hover:text-linkedinBlue">
              <Bell size={18} />
            </button>
            <button className="rounded-full border border-slate-200 bg-white p-2 shadow-sm hover:border-linkedinBlue/40 hover:text-linkedinBlue">
              <MessageSquareMore size={18} />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm md:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live Aura
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-4 px-2 py-4 sm:px-4 lg:py-6">
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <Sidebar
            user={userProps}
            aura={auraProps}
            isRefreshing={isRefreshing}
            onRefresh={handleRefreshAura}
            onProfileUpdated={(updated) => setUserData(updated)}
          />
        </aside>

        <section className="min-w-0 flex-1">
          <Feed />
        </section>

        <aside className="hidden w-[300px] shrink-0 xl:block">
          <RightSidebar />
        </aside>
      </main>
    </div>
  );
}

export default Dashboard;