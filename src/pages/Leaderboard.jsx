import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { Trophy, Crown, ArrowLeft, Share2 } from 'lucide-react';
import { getCollegeTheme } from '../utils/collegeThemes.js';

const RANK_RING = ['#f59e0b', '#94a3b8', '#b45309'];
const RANK_LABEL = ['gold', 'silver', 'bronze'];

function Leaderboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    const stored = localStorage.getItem('socialstream_user');
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    api.get('/users/leaderboard')
      .then((r) => setEntries(r.data || []))
      .catch(() => setError('Failed to load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  const theme = getCollegeTheme(currentUser?.college || '');

  const collegeEntries = entries.filter(
    (u) => u.college && currentUser?.college &&
    u.college.toLowerCase() === currentUser.college.toLowerCase()
  );

  const displayEntries = activeTab === 'college' ? collegeEntries : entries;

  if (loading) {
    return (
      <div style={{ display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center', background:'#050812', flexDirection:'column', gap:16 }}>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${theme.accent}30`, borderTopColor:theme.accent, animation:'spin 1s linear infinite' }} />
        <p style={{ color:'#4b5563', fontSize:14 }}>Loading Leaderboard...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes rowSlideIn{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes headerIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes topLineGrow{from{width:0}to{width:100%}}
        @keyframes orbDrift{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .lb-row{animation:rowSlideIn 400ms cubic-bezier(0.34,1.2,0.64,1) both}
        .lb-header{animation:headerIn 500ms cubic-bezier(0.34,1.56,0.64,1) forwards}
        .lb-orb{animation:orbDrift 10s ease-in-out infinite}
        .top-line{animation:topLineGrow 800ms cubic-bezier(0.34,1.2,0.64,1) forwards}
        .lb-tab{padding:8px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all 0.2s;background:transparent;color:#6b7280}
        .lb-tab.active{color:white}
        .lb-tab:hover:not(.active){color:#9ca3af;background:rgba(255,255,255,0.04)}
        .lb-row-item{transition:background 0.15s}
        .lb-row-item:hover{background:rgba(255,255,255,0.025)!important}
        .gradient-text{background:linear-gradient(135deg,#fbbf24,#f59e0b,#a78bfa);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
      `}</style>

      <div style={{
        minHeight:'100vh', background:theme.gradient,
        color:'white', fontFamily:'system-ui,-apple-system,sans-serif',
        position:'relative', overflowX:'hidden',
      }}>
        {/* Top accent line */}
        <div className="top-line" style={{ height:2, background:`linear-gradient(90deg,${theme.accent},${theme.tertiary},#f59e0b)`, position:'relative', zIndex:1 }} />

        {/* Background orbs */}
        <div className="lb-orb" style={{ position:'fixed', top:'-80px', right:'-80px', width:500, height:500, background:`radial-gradient(circle,${theme.glow},transparent 70%)`, filter:'blur(70px)', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'fixed', bottom:'-60px', left:'-60px', width:380, height:380, background:`radial-gradient(circle,${theme.secondaryGlow},transparent 70%)`, filter:'blur(60px)', pointerEvents:'none', zIndex:0 }} />

        {/* Logo watermark */}
        {theme.logoUrl ? (
          <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'45vw', maxWidth:600, pointerEvents:'none', zIndex:0, userSelect:'none', opacity:0.025 }}>
            <img src={theme.logoUrl} alt="" style={{ width:'100%', filter:'grayscale(100%) brightness(3)', display:'block' }} />
          </div>
        ) : (
          <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'25vw', fontWeight:900, color:'rgba(255,255,255,0.012)', pointerEvents:'none', userSelect:'none', zIndex:0, letterSpacing:'-0.05em', lineHeight:1 }}>
            {theme.badge}
          </div>
        )}

        <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 20px', position:'relative', zIndex:1 }}>

          {/* ── HEADER ── */}
          <div className="lb-header" style={{ marginBottom:28 }}>
            <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#6b7280', cursor:'pointer', fontSize:13, marginBottom:20, padding:0, transition:'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color='#9ca3af'}
              onMouseLeave={(e) => e.currentTarget.style.color='#6b7280'}
            >
              <ArrowLeft size={15} /> Back to Feed
            </button>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{
                  width:52, height:52, borderRadius:16,
                  background:`linear-gradient(135deg,#f59e0b,#fbbf24)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 0 24px rgba(245,158,11,0.4)`,
                }}>
                  <Trophy size={24} color="#000" />
                </div>
                <div>
                  <h1 style={{ fontSize:24, fontWeight:800, color:'white', marginBottom:4 }}>
                    {activeTab === 'college' ? `${theme.badge} Leaderboard` : 'Global Leaderboard'}
                  </h1>
                  <p style={{ fontSize:13, color:'#6b7280' }}>
                    {activeTab === 'college'
                      ? `Top devs from ${theme.fullName || theme.badge}`
                      : 'Top developers ranked by Aura Points across SocialStream'}
                  </p>
                </div>
              </div>

              {currentUser && (
                <div style={{
                  padding:'8px 14px', borderRadius:12,
                  border:`1px solid ${theme.accent}30`,
                  background:`${theme.accent}10`,
                  fontSize:12, color:theme.accent, textAlign:'right',
                }}>
                  <p style={{ fontWeight:700 }}>{currentUser.username}</p>
                  <p style={{ color:'#6b7280', fontSize:11 }}>Signed in</p>
                </div>
              )}
            </div>
          </div>

          {/* ── TABS ── */}
          <div style={{
            display:'flex', gap:4, marginBottom:20,
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:14, padding:4, width:'fit-content',
          }}>
            {[
              { id:'global', label:'🌍 Global' },
              { id:'college', label:`🎓 ${theme.badge || 'My College'}` },
              { id:'city', label:'📍 City' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`lb-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? {
                  background:`linear-gradient(135deg,${theme.accent},${theme.tertiary})`,
                  boxShadow:`0 0 16px ${theme.accent}40`,
                } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── CITY PLACEHOLDER ── */}
          {activeTab === 'city' && (
            <div style={{
              borderRadius:20, border:'1px solid rgba(255,255,255,0.07)',
              background:'#111118', padding:'60px 20px', textAlign:'center',
            }}>
              <div style={{ fontSize:48, marginBottom:16 }}>📍</div>
              <h3 style={{ fontSize:18, fontWeight:700, color:'white', marginBottom:8 }}>City Leaderboards Coming Soon</h3>
              <p style={{ fontSize:14, color:'#6b7280' }}>We're mapping devs by city. Hyderabad is going to go crazy on this one.</p>
            </div>
          )}

          {/* ── EMPTY COLLEGE STATE ── */}
          {activeTab === 'college' && collegeEntries.length < 3 && (
            <div style={{
              borderRadius:16, border:`1px solid ${theme.accent}20`,
              background:`${theme.accent}08`, padding:'20px 20px 16px',
              marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
            }}>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:4 }}>
                  {collegeEntries.length === 0
                    ? `Be the first to rep ${theme.fullName || theme.badge} on SocialStream 🔥`
                    : `Only ${collegeEntries.length} dev${collegeEntries.length > 1 ? 's' : ''} from ${theme.badge} so far — grow the squad`}
                </p>
                <p style={{ fontSize:12, color:'#6b7280' }}>Invite your classmates to join and compete</p>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(window.location.origin); }}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'8px 16px', borderRadius:10,
                  background:`${theme.accent}20`, border:`1px solid ${theme.accent}40`,
                  color:theme.accent, fontSize:12, fontWeight:600, cursor:'pointer',
                  whiteSpace:'nowrap', flexShrink:0,
                }}
              >
                <Share2 size={13} /> Share Link
              </button>
            </div>
          )}

          {/* ── ERROR ── */}
          {error && (
            <div style={{ borderRadius:12, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.08)', padding:'12px 16px', marginBottom:16, fontSize:13, color:'#f87171' }}>
              {error}
            </div>
          )}

          {/* ── TABLE ── */}
          {activeTab !== 'city' && (
            <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', background:'#111118' }}>
              {/* Column headers */}
              <div style={{
                display:'flex', alignItems:'center',
                padding:'12px 20px',
                borderBottom:'1px solid rgba(255,255,255,0.06)',
                background:'rgba(0,0,0,0.3)',
              }}>
                <div style={{ width:56, fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#374151' }}>RANK</div>
                <div style={{ flex:1, fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#374151' }}>USER</div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#374151' }}>AURA POINTS</div>
              </div>

              {/* Rows */}
              {displayEntries.length === 0 ? (
                <div style={{ padding:'48px 20px', textAlign:'center' }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>✦</div>
                  <p style={{ fontSize:14, color:'#4b5563' }}>No users yet. Start solving and competing to appear here.</p>
                </div>
              ) : (
                displayEntries.map((user, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const isCurrent = currentUser?.username === user.username;
                  const ringColor = isTop3 ? RANK_RING[index] : null;

                  return (
                    <div
                      key={user.username || index}
                      className="lb-row lb-row-item"
                      style={{
                        display:'flex', alignItems:'center', gap:16,
                        padding:'14px 20px',
                        borderBottom:'1px solid rgba(255,255,255,0.04)',
                        borderLeft: isTop3 ? `3px solid ${RANK_RING[index]}` : isCurrent ? `3px solid ${theme.accent}` : '3px solid transparent',
                        background: rank === 1 ? 'rgba(245,158,11,0.04)' : rank === 2 ? 'rgba(148,163,184,0.03)' : rank === 3 ? 'rgba(180,83,9,0.03)' : isCurrent ? `${theme.accent}08` : 'transparent',
                        animationDelay:`${index * 45}ms`,
                      }}
                    >
                      {/* Rank badge */}
                      <div style={{ width:40, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {isTop3 ? (
                          <div style={{
                            width:32, height:32, borderRadius:'50%',
                            background:rank===1?'linear-gradient(135deg,#f59e0b,#fbbf24)':rank===2?'linear-gradient(135deg,#94a3b8,#cbd5e1)':'linear-gradient(135deg,#b45309,#d97706)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:13, fontWeight:800, color:rank===1?'#000':'#000',
                            boxShadow:`0 0 12px ${RANK_RING[index]}60`,
                          }}>
                            {rank === 1 ? '👑' : rank}
                          </div>
                        ) : (
                          <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>#{rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div style={{ flexShrink:0 }}>
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.fullName || user.username}
                            style={{
                              width:40, height:40, borderRadius:'50%', objectFit:'cover',
                              boxShadow: ringColor ? `0 0 0 2px ${ringColor}, 0 0 16px ${ringColor}50` : isCurrent ? `0 0 0 2px ${theme.accent}` : 'none',
                            }} />
                        ) : (
                          <div style={{
                            width:40, height:40, borderRadius:'50%',
                            background: isTop3 ? `linear-gradient(135deg,${RANK_RING[index]}40,#1a1a2e)` : '#1a1a2e',
                            border:`2px solid ${ringColor || (isCurrent ? theme.accent : 'rgba(255,255,255,0.08)')}`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:15, fontWeight:800, color:'white',
                            boxShadow: ringColor ? `0 0 16px ${ringColor}40` : 'none',
                          }}>
                            {(user.fullName || user.username || '?')[0].toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* User info */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                          <span style={{ fontSize:14, fontWeight:700, color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {user.fullName || user.username}
                          </span>
                          {rank === 1 && (
                            <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:99, background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', flexShrink:0 }}>
                              Top 1
                            </span>
                          )}
                          {isCurrent && (
                            <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:99, background:`${theme.accent}20`, color:theme.accent, border:`1px solid ${theme.accent}40`, flexShrink:0 }}>
                              You
                            </span>
                          )}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontSize:11, color:'#4b5563' }}>@{user.username}</span>
                          <span style={{ fontSize:11, color:'#374151' }}>•</span>
                          <span style={{ fontSize:11, color:'#4b5563' }}>{user.rankTitle || 'Novice'}</span>
                          {user.college && (
                            <>
                              <span style={{ fontSize:11, color:'#374151' }}>•</span>
                              <span style={{ fontSize:11, color:'#4b5563', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{user.college}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Aura points */}
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p className={isTop3 ? 'gradient-text' : ''} style={{
                          fontSize:16, fontWeight:800,
                          color: isTop3 ? undefined : isCurrent ? theme.accent : '#9ca3af',
                        }}>
                          {(user.auraPoints ?? 0).toLocaleString()}
                        </p>
                        <p style={{ fontSize:11, color:'#374151' }}>Aura</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Back to dashboard */}
          <div style={{ textAlign:'center', marginTop:32 }}>
            <button onClick={() => navigate('/')} style={{
              padding:'12px 28px', borderRadius:14,
              background:`linear-gradient(135deg,${theme.accent},${theme.tertiary})`,
              border:'none', color:'white', fontSize:14, fontWeight:600,
              cursor:'pointer', transition:'transform 0.15s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform='scale(1.03)'; e.currentTarget.style.boxShadow=`0 0 24px ${theme.accent}50`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
            >
              ← Back to Dashboard
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Leaderboard;