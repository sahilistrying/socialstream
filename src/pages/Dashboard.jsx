import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, MessageSquareMore, Search, Menu, X, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Feed from '../components/Feed.jsx';
import RightSidebar from '../components/RightSidebar.jsx';
import api from '../api'; // Use your new API helper

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [username, setUsername] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New State for Mobile
  const navigate = useNavigate();

  // Read current user
  useEffect(() => {
    const stored = localStorage.getItem('socialstream_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.username) setUsername(parsed.username);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  // Fetch Data
  useEffect(() => {
    if (!username) return;
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${username}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUserData();
  }, [username]);

  const handleRefreshAura = async () => {
    if (!username) return;
    try {
      setIsRefreshing(true);
      const response = await api.post(`/users/${username}/refresh`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error refreshing Aura:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linkedinBg">
        <p className="text-lg font-medium text-slate-600 animate-pulse">Loading SocialStream...</p>
      </div>
    );
  }

  // Props preparation
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
  const progress = Math.min(100, Math.round((((userData.auraPoints || 0) - currentLevelStartPoints) / (nextLevelStartPoints - currentLevelStartPoints)) * 100));

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
      
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button (Only visible on Phone) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-linkedinBlue via-sky-500 to-indigo-500 text-white font-semibold shadow-md">
                SS
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="text-sm font-semibold tracking-tight text-slate-900">SocialStream</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Dev Network</div>
              </div>
            </div>
          </div>

          {/* Middle: Search (Hidden on super small phones) */}
          <div className="hidden flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-500 md:flex max-w-md mx-4">
            <Search size={16} className="text-slate-400" />
            <input className="h-6 w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search..." />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 text-slate-500">
            {/* Mobile Leaderboard Icon */}
            <button 
              onClick={() => navigate('/leaderboard')}
              className="lg:hidden rounded-full p-2 text-yellow-600 hover:bg-yellow-50"
            >
              <Trophy size={20} />
            </button>

            <button className="hidden sm:block rounded-full border border-slate-200 bg-white p-2 hover:text-linkedinBlue">
              <Bell size={18} />
            </button>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live Aura
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="mx-auto flex max-w-6xl gap-4 px-0 sm:px-4 py-0 sm:py-4 lg:py-6">
        
        {/* DESKTOP Sidebar (Hidden on Mobile) */}
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <Sidebar user={userProps} aura={auraProps} isRefreshing={isRefreshing} onRefresh={handleRefreshAura} onProfileUpdated={setUserData} />
        </aside>

        {/* FEED (Full width on mobile) */}
        <section className="min-w-0 flex-1 px-0 sm:px-0">
          <Feed />
        </section>

        {/* DESKTOP Right Sidebar (Hidden on Mobile) */}
        <aside className="hidden w-[300px] shrink-0 xl:block">
          <RightSidebar />
        </aside>
      </main>

      {/* MOBILE DRAWER (The Fix!) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Black Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide-out Sidebar */}
          <div className="relative w-[85%] max-w-[300px] bg-slate-50 h-full shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-slate-500"
            >
              <X size={20} />
            </button>

            <div className="mt-8">
              <Sidebar 
                user={userProps} 
                aura={auraProps} 
                isRefreshing={isRefreshing} 
                onRefresh={handleRefreshAura} 
                onProfileUpdated={setUserData} 
              />
            </div>

            {/* Extra Mobile Links */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <button 
                onClick={() => navigate('/leaderboard')}
                className="flex w-full items-center gap-3 rounded-lg bg-white p-3 font-semibold text-slate-700 shadow-sm"
              >
                <Trophy className="text-yellow-500" size={20} />
                Global Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;