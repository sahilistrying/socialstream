import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, X, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Feed from '../components/Feed.jsx';
import RightSidebar from '../components/RightSidebar.jsx';
import OnboardingModal from '../components/OnboardingModal.jsx';
import AuraTicker from '../components/AuraTicker.jsx';
import { getCollegeTheme } from '../utils/collegeThemes.js';
import api from '../api';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [username, setUsername] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('socialstream_user') || localStorage.getItem('user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.username) setUsername(parsed.username);
        else navigate('/login');
      } catch { navigate('/login'); }
    } else { navigate('/login'); }
  }, [navigate]);

  useEffect(() => {
    if (!username) return;
    api.get(`/users/${username}`)
      .then((r) => setUserData(r.data))
      .catch(() => {
        localStorage.removeItem('socialstream_user');
        localStorage.removeItem('user');
        navigate('/login');
      });
  }, [username, navigate]);

  const handleRefreshAura = async () => {
    if (!username) return;
    try {
      setIsRefreshing(true);
      const r = await api.post(`/users/${username}/refresh`);
      setUserData(r.data);
    } catch (e) { console.error(e); }
    finally { setIsRefreshing(false); }
  };

  if (!userData) {
    return (
      <div style={{
        display: 'flex', minHeight: '100vh',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0f', flexDirection: 'column', gap: 16,
      }}>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(124,58,237,0.2)',
          borderTopColor: '#7c3aed',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ color: '#4b5563', fontSize: 14 }}>Loading SocialStream...</p>
      </div>
    );
  }

  const theme = getCollegeTheme(userData.college || '');
  const level = Math.max(1, Math.floor((userData.auraPoints || 0) / 1000) + 1);
  const levelStart = (level - 1) * 1000;
  const levelEnd = level * 1000;
  const progress = Math.min(100, Math.round((((userData.auraPoints || 0) - levelStart) / (levelEnd - levelStart)) * 100));

  const userProps = {
    username: userData.username,
    name: userData.fullName || userData.username,
    headline: userData.bio || 'CS Student',
    avatarInitial: (userData.fullName || userData.username)[0].toUpperCase(),
    profilePicture: userData.profilePicture,
    bio: userData.bio || '',
    leetcodeHandle: userData.leetcodeHandle || '',
    codeforcesHandle: userData.codeforcesHandle || '',
    githubHandle: userData.githubHandle || '',
    fullName: userData.fullName || '',
    college: userData.college || '',
  };

  const auraProps = {
    totalAura: userData.auraPoints || 0,
    level,
    progress,
    rankTitle: userData.rankTitle || 'Novice',
    globalRank: userData.stats?.leetcode?.ranking || 0,
    streak: userData.currentStreak || 0,
  };

  const NOTIFS = [
    { icon: '🏆', text: `You moved up to Rank #5 on ${theme.badge} leaderboard`, time: '2h ago' },
    { icon: '⚡', text: 'Codeforces Round #980 starts in 30 minutes', time: '30m ago' },
    { icon: '🔥', text: "Your 7-day streak is active — don't break it!", time: '5h ago' },
  ];

  return (
    <>
      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes notifDrop {
          from{opacity:0;transform:translateY(-10px) scale(0.97)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes bellRing {
          0%{transform:rotate(0)} 10%{transform:rotate(15deg)} 20%{transform:rotate(-12deg)}
          30%{transform:rotate(10deg)} 40%{transform:rotate(-8deg)} 50%,100%{transform:rotate(0)}
        }
        @keyframes mobileSlideIn {
          from{transform:translateX(-100%)} to{transform:translateX(0)}
        }
        .notif-dropdown { animation: notifDrop 200ms ease forwards; }
        .bell-ring { animation: bellRing 0.5s ease; }
        .mobile-drawer { animation: mobileSlideIn 280ms cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .nav-icon-btn {
          width:36px; height:36px; border-radius:10px;
          border:1px solid rgba(255,255,255,0.08);
          background:rgba(255,255,255,0.03);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#6b7280;
          transition:background 0.2s,color 0.2s,border-color 0.2s;
        }
        .nav-icon-btn:hover {
          background:rgba(255,255,255,0.07);
          border-color:rgba(255,255,255,0.14); color:white;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: theme.gradient,
        color: 'white',
        fontFamily: 'system-ui,-apple-system,sans-serif',
        position: 'relative',
      }}>

        {/* College watermark */}
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontSize: '30vw', fontWeight: 900,
          color: 'rgba(255,255,255,0.012)',
          pointerEvents: 'none', userSelect: 'none',
          zIndex: 0, letterSpacing: '-0.05em',
          lineHeight: 1,
        }}>
          {theme.badge}
        </div>

        {/* Accent orbs */}
        <div style={{
          position: 'fixed', top: '-100px', right: '-100px',
          width: 500, height: 500,
          background: `radial-gradient(circle,${theme.glow},transparent 70%)`,
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'fixed', bottom: '-100px', left: '-100px',
          width: 400, height: 400,
          background: `radial-gradient(circle,${theme.glow},transparent 70%)`,
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* NAVBAR */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px',
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                className="mobile-menu-btn"
              >
                <Menu size={22} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `linear-gradient(135deg,${theme.accent},${theme.secondary})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: 'white',
                  boxShadow: `0 0 16px ${theme.accent}40`,
                }}>SS</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>SocialStream</p>
                  <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4b5563' }}>Dev Network</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div style={{
              flex: 1, maxWidth: 360, margin: '0 24px',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '8px 14px',
            }}>
              <Search size={14} style={{ color: '#4b5563', flexShrink: 0 }} />
              <input placeholder="Search devs, posts, contests..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 13, color: 'white',
                }}
              />
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Live Aura */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 99,
                border: '1px solid rgba(16,185,129,0.25)',
                background: 'rgba(16,185,129,0.06)',
                fontSize: 12, fontWeight: 500, color: '#10b981',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#10b981', boxShadow: '0 0 6px #10b981',
                  animation: 'bellRing 3s ease infinite',
                }} />
                Live Aura
              </div>

              {/* Notification bell */}
              <div style={{ position: 'relative' }}>
                <button
                  className="nav-icon-btn"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <Bell size={16} className={notifOpen ? 'bell-ring' : ''} />
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#ef4444',
                    border: '1px solid #0a0a0f',
                  }} />
                </button>

                {notifOpen && (
                  <div className="notif-dropdown" style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    width: 300, background: '#111118',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 16, overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    zIndex: 50,
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Notifications</p>
                    </div>
                    {NOTIFS.map((n, i) => (
                      <div key={i} style={{
                        padding: '12px 16px',
                        borderBottom: i < NOTIFS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        borderLeft: `3px solid ${theme.accent}`,
                        background: i === 0 ? `${theme.accent}08` : 'transparent',
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                      }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                        <div>
                          <p style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.5 }}>{n.text}</p>
                          <p style={{ fontSize: 10, color: '#4b5563', marginTop: 3 }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="nav-icon-btn"
                onClick={() => navigate('/leaderboard')}
              >
                <Trophy size={16} style={{ color: '#f59e0b' }} />
              </button>
            </div>
          </div>
        </header>

        {/* Live ticker */}
        <AuraTicker accentColor={theme.accent} />

        {/* Main layout */}
        <main style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', gap: 20,
          padding: '20px 20px',
          position: 'relative', zIndex: 1,
        }}>
          {/* Left sidebar */}
          <aside style={{ width: 280, flexShrink: 0 }}>
            <Sidebar
              user={userProps}
              aura={auraProps}
              isRefreshing={isRefreshing}
              onRefresh={handleRefreshAura}
              onProfileUpdated={setUserData}
              theme={theme}
            />
          </aside>

          {/* Feed */}
          <section style={{ flex: 1, minWidth: 0 }}>
            <Feed accentColor={theme.accent} />
          </section>

          {/* Right sidebar */}
          <aside style={{ width: 300, flexShrink: 0 }}>
            <RightSidebar theme={theme} />
          </aside>
        </main>

        {/* Onboarding modal */}
        <OnboardingModal
          open={Boolean(userData && userData.onboardingComplete !== true)}
          initialUser={userData}
          onComplete={(updated) => {
            setUserData(updated);
            const raw = localStorage.getItem('socialstream_user') || localStorage.getItem('user');
            try {
              const prev = raw ? JSON.parse(raw) : {};
              const merged = JSON.stringify({ ...prev, ...updated });
              localStorage.setItem('socialstream_user', merged);
              localStorage.setItem('user', merged);
            } catch { localStorage.setItem('socialstream_user', JSON.stringify(updated)); }
          }}
        />

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="mobile-drawer" style={{
              position: 'relative', width: '80%', maxWidth: 300,
              height: '100%', background: '#111118',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              padding: '20px 16px', overflowY: 'auto',
            }}>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', border: 'none',
                  color: '#9ca3af', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
              <div style={{ marginTop: 40 }}>
                <Sidebar user={userProps} aura={auraProps} isRefreshing={isRefreshing} onRefresh={handleRefreshAura} onProfileUpdated={setUserData} theme={theme} />
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={() => navigate('/leaderboard')}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: '#f59e0b', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <Trophy size={16} /> Global Leaderboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;