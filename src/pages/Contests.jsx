import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { Calendar, ExternalLink, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { getCollegeTheme } from '../utils/collegeThemes.js';

const PLATFORM_CONFIG = {
  Codeforces: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', left: '#3b82f6' },
  LeetCode:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', left: '#f59e0b' },
  CodeChef:   { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', left: '#8b5cf6' },
};

function getConfig(site) {
  return PLATFORM_CONFIG[site] || { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)', left: '#7c3aed' };
}

function useCountdown(startTimeStr) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const target = new Date(startTimeStr).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (isNaN(diff) || diff <= 0) { setTimeLeft('Starting now'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setTimeLeft(`${d}d ${h}h ${m}m`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m ${s}s`);
      else setTimeLeft(`${m}m ${s}s`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTimeStr]);

  return timeLeft;
}

function ContestCard({ item, onAddToCalendar, accentColor }) {
  const cfg = getConfig(item.site);
  const countdown = useCountdown(item.start_time);
  const isUrgent = countdown.includes('m') && !countdown.includes('h') && !countdown.includes('d');

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${cfg.left}`,
      borderRadius: 16,
      padding: '18px 20px',
      transition: 'border-color 0.2s, transform 0.15s',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${cfg.left}`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Platform badge + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 99,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            fontSize: 10, fontWeight: 700, color: cfg.color,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>{item.site}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#10b981' }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#10b981',
              boxShadow: '0 0 6px #10b981',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            {item.status === 'CODING' ? 'Live Now' : 'Upcoming'}
          </span>
        </div>

        {/* Contest name */}
        <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 10, lineHeight: 1.3 }}>
          {item.name}
        </p>

        {/* Start time + countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
            <Clock size={12} />
            <span>{item.start_time}</span>
          </div>
          {countdown && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 8,
              background: isUrgent ? 'rgba(239,68,68,0.1)' : `${cfg.bg}`,
              border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : cfg.border}`,
              fontSize: 12, fontWeight: 700,
              color: isUrgent ? '#ef4444' : cfg.color,
            }}>
              ⏱ {countdown}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        {item.url && (
          <a href={item.url} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 10,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#9ca3af', fontSize: 12, fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9ca3af'; }}
          >
            <ExternalLink size={12} /> View
          </a>
        )}
        <button
          onClick={() => onAddToCalendar(item)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 10,
            background: `linear-gradient(135deg,${cfg.color},${cfg.color}cc)`,
            border: 'none', color: 'white',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 0 16px ${cfg.color}60`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <Calendar size={12} /> Add
        </button>
      </div>
    </div>
  );
}

function Contests() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [googleToken, setGoogleToken] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('socialstream_user')); } catch { return null; }
  })();
  const theme = getCollegeTheme(currentUser?.college || '');

  const handleGoogleLogin = useGoogleLogin({
    scope: 'openid profile email https://www.googleapis.com/auth/calendar.events',
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleToken(tokenResponse.access_token);
        const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        setGoogleProfile(profileRes.data);
        const authRes = await api.post('/google/auth', { accessToken: tokenResponse.access_token });
        localStorage.setItem('socialstream_token', authRes.data.token);
        localStorage.setItem('socialstream_user', JSON.stringify(authRes.data.user));
        setError('');
      } catch { setError('Google sign-in failed. Please try again.'); }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  useEffect(() => {
    let active = true;
    const fallback = [
      { name: 'LeetCode Weekly Contest 420', site: 'LeetCode', status: 'UPCOMING', start_time: new Date(Date.now() + 86400000).toString(), url: 'https://leetcode.com/contest/' },
      { name: 'CodeChef Starters 125 (Div 2 & 3)', site: 'CodeChef', status: 'UPCOMING', start_time: new Date(Date.now() + 259200000).toString(), url: 'https://www.codechef.com/contests' },
      { name: 'Codeforces Round #981 (Div. 2)', site: 'Codeforces', status: 'UPCOMING', start_time: new Date(Date.now() + 172800000).toString(), url: 'https://codeforces.com/contests' },
    ];

    async function load() {
      setLoading(true);
      try {
        const res = await axios.get('https://codeforces.com/api/contest.list', { timeout: 6000 });
        if (!active) return;
        if (res.data?.status === 'OK') {
          const upcoming = res.data.result
            .filter((c) => c.phase === 'BEFORE')
            .map((c) => ({
              name: c.name, site: 'Codeforces', status: 'UPCOMING',
              start_time: new Date(c.startTimeSeconds * 1000).toString(),
              url: 'https://codeforces.com/contests',
            }))
            .slice(0, 8);
          setContests([...fallback.filter(f => f.site !== 'Codeforces'), ...upcoming]);
        } else { setContests(fallback); }
      } catch { if (active) setContests(fallback); }
      finally { if (active) setLoading(false); }
    }

    load();
    return () => { active = false; };
  }, []);

  const handleSaveToCalendar = async (contest) => {
    if (!googleToken) {
      setError('Sign in with Google first (top right) to save contests to your calendar.');
      return;
    }
    try {
      await api.post('/google/calendar', { accessToken: googleToken, contest });
      setAddedIds((prev) => new Set([...prev, contest.name]));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to Google Calendar.');
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes orbDrift{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes headerIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes topLine{from{width:0}to{width:100%}}
        .contest-header{animation:headerIn 500ms cubic-bezier(0.34,1.56,0.64,1) forwards}
        .contest-card{animation:cardIn 400ms cubic-bezier(0.34,1.2,0.64,1) both}
        .orb{animation:orbDrift 10s ease-in-out infinite}
      `}</style>

      <div style={{
        minHeight: '100vh', background: theme.gradient,
        color: 'white', fontFamily: 'system-ui,-apple-system,sans-serif',
        position: 'relative', overflowX: 'hidden',
      }}>
        {/* Top accent line */}
        <div className="topLine" style={{ height: 2, background: `linear-gradient(90deg,${theme.accent},${theme.tertiary},#f59e0b)` }} />

        {/* Orbs */}
        <div className="orb" style={{ position: 'fixed', top: '-80px', right: '-80px', width: 500, height: 500, background: `radial-gradient(circle,${theme.glow},transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-60px', left: '-60px', width: 350, height: 350, background: `radial-gradient(circle,${theme.secondaryGlow},transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Logo watermark */}
        {theme.logoUrl ? (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '45vw', maxWidth: 600, pointerEvents: 'none', zIndex: 0, opacity: 0.025 }}>
            <img src={theme.logoUrl} alt="" style={{ width: '100%', filter: 'grayscale(100%) brightness(3)', display: 'block' }} />
          </div>
        ) : (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '25vw', fontWeight: 900, color: 'rgba(255,255,255,0.012)', pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>
            {theme.badge}
          </div>
        )}

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div className="contest-header" style={{ marginBottom: 28 }}>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              <ArrowLeft size={15} /> Back to Feed
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 10 }}>
                  ✦ CONTEST SYNC
                </p>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 6 }}>
                  Coding Contests
                </h1>
                <p style={{ fontSize: 14, color: '#6b7280' }}>
                  Upcoming contests across platforms. Add them to your Google Calendar.
                </p>
              </div>

              {/* Google auth */}
              <div>
                {googleProfile ? (
                  <div style={{
                    padding: '10px 16px', borderRadius: 12,
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    fontSize: 12, textAlign: 'right',
                  }}>
                    <p style={{ color: '#10b981', fontWeight: 700 }}>{googleProfile.name}</p>
                    <p style={{ color: '#6b7280', fontSize: 11 }}>✓ Calendar connected</p>
                  </div>
                ) : (
                  <button
                    onClick={() => { setError(''); handleGoogleLogin(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 18px', borderRadius: 12,
                      background: '#111118',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${theme.accent}60`; e.currentTarget.style.boxShadow = `0 0 16px ${theme.accent}30`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>
              {error}
            </div>
          )}

          {/* Contest list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 0' }}>
              <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${theme.accent}30`, borderTopColor: theme.accent, animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 13, color: '#4b5563' }}>Syncing live contests...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contests.map((item, i) => (
                <div key={item.name + item.start_time} className="contest-card" style={{ animationDelay: `${i * 60}ms` }}>
                  <ContestCard
                    item={item}
                    onAddToCalendar={handleSaveToCalendar}
                    accentColor={theme.accent}
                  />
                  {addedIds.has(item.name) && (
                    <p style={{ fontSize: 11, color: '#10b981', marginTop: 4, marginLeft: 4 }}>
                      ✓ Added to Google Calendar
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Back button */}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={() => navigate('/')} style={{
              padding: '12px 28px', borderRadius: 14,
              background: `linear-gradient(135deg,${theme.accent},${theme.tertiary})`,
              border: 'none', color: 'white', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 0 24px ${theme.accent}50`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contests;