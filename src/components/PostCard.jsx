// PostCard.jsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, Repeat2, ThumbsUp } from 'lucide-react';
import api from '../api.js';

export function PostCard({ post, onPostUpdated, accentColor }) {
  const accent = accentColor || '#7c3aed';
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('socialstream_user');
    if (stored) {
      try { setCurrentUserId(JSON.parse(stored)?._id || JSON.parse(stored)?.id); } catch {}
    }
  }, []);

  useEffect(() => {
    if (currentUserId && post.likes) {
      setIsLiked(post.likes.some((id) => String(typeof id === 'object' ? id._id || id.id : id) === String(currentUserId)));
    }
    setLikeCount(post.likes?.length || 0);
  }, [post.likes, currentUserId]);

  const formatTime = (d) => {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    if (s < 604800) return `${Math.floor(s/86400)}d ago`;
    return `${Math.floor(s/604800)}w ago`;
  };

  const handleLike = async () => {
    if (isLiking || !currentUserId) return;
    setIsLiking(true);
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      if (onPostUpdated) onPostUpdated(res.data);
      setIsLiked(!isLiked);
      setLikeCount(res.data.likes?.length || 0);
    } catch (err) {
      if (err.response?.status === 401) alert('Please log in to like posts');
    } finally { setIsLiking(false); }
  };

  const author = post.author || {};
  const authorName = author.fullName || author.username || 'Unknown';

  return (
    <article style={{
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      background: '#111118',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {author.profilePicture ? (
            <img src={author.profilePicture} alt={authorName}
              style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white',
            }}>{authorName[0]?.toUpperCase()}</div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{authorName}</span>
              {author.rankTitle && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                  background: `${accent}18`, color: accent,
                  border: `1px solid ${accent}30`, textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>{author.rankTitle}</span>
              )}
            </div>
            <p style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>{formatTime(post.createdAt)}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', fontSize: 14, color: '#d1d5db', lineHeight: 1.7 }}>
        <p style={{ whiteSpace: 'pre-line' }}>{post.content}</p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '10px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        {[
          { icon: <ThumbsUp size={14} style={{ fill: isLiked ? accent : 'none' }} />, label: `${likeCount > 0 ? likeCount : ''} Like${likeCount !== 1 ? 's' : ''}`, onClick: handleLike, active: isLiked },
          { icon: <MessageCircle size={14} />, label: 'Comment', onClick: null },
          { icon: <Repeat2 size={14} />, label: 'Repost', onClick: null },
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick}
            disabled={i === 0 && (isLiking || !currentUserId)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              background: 'transparent', border: 'none',
              fontSize: 12, cursor: 'pointer',
              color: btn.active ? accent : '#6b7280',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = btn.active ? accent : '#9ca3af'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = btn.active ? accent : '#6b7280'; }}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>
    </article>
  );
}

export default PostCard;