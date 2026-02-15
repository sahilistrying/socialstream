import React, { useState, useEffect } from 'react';
import { MessageCircle, Repeat2, ThumbsUp } from 'lucide-react';
import api from '../api.js';

function PostCard({ post, onPostUpdated }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user ID from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('socialstream_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUserId(parsed._id || parsed.id);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  // Check if current user has liked this post
  useEffect(() => {
    if (currentUserId && post.likes) {
      const liked = post.likes.some((likeId) => {
        const id = typeof likeId === 'object' && likeId !== null ? likeId._id || likeId.id : likeId;
        return String(id) === String(currentUserId);
      });
      setIsLiked(liked);
    }
    setLikeCount(post.likes?.length || 0);
  }, [post.likes, currentUserId]);

  // Format relative time (e.g., "2h ago", "3d ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w ago`;
    }
  };

  const handleLike = async () => {
    if (isLiking || !currentUserId) return;

    setIsLiking(true);
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      if (onPostUpdated) {
        onPostUpdated(res.data);
      }
      setIsLiked(!isLiked);
      setLikeCount(res.data.likes?.length || 0);
    } catch (err) {
      console.error('Error toggling like:', err);
      if (err.response?.status === 401) {
        alert('Please log in to like posts');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const author = post.author || {};
  const authorName = author.fullName || author.username || 'Unknown';
  const authorInitials = authorName[0].toUpperCase();
  const authorSubtitle = author.rankTitle || 'Member';
  const relativeTime = formatRelativeTime(post.createdAt || new Date());

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white text-sm shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-start gap-3">
          {author.profilePicture ? (
            <img
              src={author.profilePicture}
              alt={authorName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {authorInitials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[13px] font-semibold tracking-tight text-slate-900">
                {authorName}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">{authorSubtitle}</p>
            <p className="mt-1 text-[11px] text-slate-400">{relativeTime}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3 pt-2 text-[13px] text-slate-800">
        <p className="whitespace-pre-line">{post.content}</p>
      </div>

      <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={isLiking || !currentUserId}
            className={`inline-flex items-center gap-1 transition-colors ${
              isLiked
                ? 'text-linkedinBlue'
                : 'hover:text-linkedinBlue'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <ThumbsUp size={14} className={isLiked ? 'fill-linkedinBlue' : ''} />
            <span>{likeCount > 0 ? likeCount : ''} Like{likeCount !== 1 ? 's' : ''}</span>
          </button>
          <button className="inline-flex items-center gap-1 hover:text-linkedinBlue">
            <MessageCircle size={14} />
            <span>Comment</span>
          </button>
          <button className="inline-flex items-center gap-1 hover:text-linkedinBlue">
            <Repeat2 size={14} />
            <span>Repost</span>
          </button>
        </div>
      </footer>
    </article>
  );
}

export default PostCard;

