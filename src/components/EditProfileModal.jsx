import React, { useState, useEffect } from 'react';
import api from '../api.js';
import { X, User2, Code2 } from 'lucide-react';

function EditProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [leetcodeHandle, setLeetcodeHandle] = useState('');
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [githubHandle, setGithubHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || user.name || '');
      setBio(user.bio || '');
      setLeetcodeHandle(user.leetcodeHandle || '');
      setCodeforcesHandle(user.codeforcesHandle || '');
      setGithubHandle(user.githubHandle || '');
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.put(
        `/users/${user.username}`,
        {
          fullName,
          bio,
          leetcodeHandle,
          codeforcesHandle,
          githubHandle,
        },
      );

      if (onProfileUpdated) {
        onProfileUpdated(response.data);
      }

      onClose();
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update profile. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/95 p-5 text-slate-50 shadow-2xl shadow-slate-900/80">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-linkedinBlue via-sky-500 to-indigo-500">
              <User2 size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Edit Profile</h2>
              <p className="text-[11px] text-slate-400">
                Keep your identity and handles in sync with your Aura.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-200">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-linkedinBlue/40 placeholder:text-slate-500 focus:border-linkedinBlue focus:ring"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-200">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-linkedinBlue/40 placeholder:text-slate-500 focus:border-linkedinBlue focus:ring"
                placeholder="CS Student @ CVR • Full-stack dev • Competitive programmer"
              />
            </div>
          </div>

          <div className="mt-2 grid gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              <Code2 size={14} className="text-slate-400" />
              Coding Handles
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">
                  LeetCode Username
                </label>
                <input
                  type="text"
                  value={leetcodeHandle}
                  onChange={(e) => setLeetcodeHandle(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-linkedinBlue/40 placeholder:text-slate-500 focus:border-linkedinBlue focus:ring"
                  placeholder="leetcode_user"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">
                  Codeforces Handle
                </label>
                <input
                  type="text"
                  value={codeforcesHandle}
                  onChange={(e) => setCodeforcesHandle(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-linkedinBlue/40 placeholder:text-slate-500 focus:border-linkedinBlue focus:ring"
                  placeholder="codeforces_handle"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={githubHandle}
                  onChange={(e) => setGithubHandle(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-linkedinBlue/40 placeholder:text-slate-500 focus:border-linkedinBlue focus:ring"
                  placeholder="github_user"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
              {error}
            </p>
          )}

          <div className="mt-3 flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-600 bg-transparent px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-linkedinBlue px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-linkedinBlue/40 hover:bg-linkedinBlue/90 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

