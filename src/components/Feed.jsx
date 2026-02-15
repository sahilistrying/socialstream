import React, { useState, useEffect } from 'react';
import { Image, Sparkles, Video } from 'lucide-react';
import PostCard from './PostCard.jsx';
import api from '../api.js';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('socialstream_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/posts', { content: postContent.trim() });
      // Add new post to the beginning of the list
      setPosts([res.data, ...posts]);
      setPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      alert(err.response?.data?.error || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const userInitials = currentUser
    ? (currentUser.fullName || currentUser.username || 'U')[0].toUpperCase()
    : 'U';

  return (
    <div className="space-y-3">
      {/* Create Post */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmitPost}>
          <div className="flex gap-3 px-4 py-3">
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.fullName || currentUser.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {userInitials}
              </div>
            )}
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share what you're building or solving today..."
              className="flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-[13px] text-slate-900 outline-none ring-linkedinBlue/20 placeholder:text-slate-500 focus:border-linkedinBlue focus:ring"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-linkedinBlue"
                disabled={isSubmitting}
              >
                <Image size={16} />
                <span>Media</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-linkedinBlue"
                disabled={isSubmitting}
              >
                <Video size={16} />
                <span>Stream</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-linkedinBlue/5 px-2 py-1 text-[10px] text-linkedinBlue">
                <Sparkles size={14} />
                <span>Posting boosts Aura</span>
              </div>
              <button
                type="submit"
                disabled={!postContent.trim() || isSubmitting}
                className="rounded-lg bg-linkedinBlue px-4 py-1.5 text-[11px] font-medium text-white shadow-sm shadow-linkedinBlue/40 transition hover:bg-linkedinBlue/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Feed posts */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-slate-500">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-slate-500">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;

