import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User2, ArrowRight } from 'lucide-react';
import api from '../api.js';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      localStorage.setItem('socialstream_token', res.data.token);
      localStorage.setItem('socialstream_user', JSON.stringify(res.data.user));

      navigate('/');
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to register. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* Left: Hero / gradient */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-700 to-fuchsia-600 md:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,252,203,0.28),transparent_55%)]" />
        <div className="relative max-w-md px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-200/80">
            Join the Network
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Start your
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-200 bg-clip-text text-transparent">
              Aura Journey
            </span>
          </h1>
          <p className="mt-4 text-sm text-indigo-100/90">
            Create a profile that showcases the grind behind your GitHub graph, Codeforces rating,
            and LeetCode streaks.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-indigo-100/90">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Unlock levels and titles as you grow
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Compete on leaderboards with your classmates
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
              Prepare a profile that recruiters actually remember
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex min-h-screen flex-1 items-center justify-center bg-linkedinBg px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-900/5">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Create your SocialStream account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              It takes less than a minute. You can connect GitHub/LeetCode later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <User2 size={14} className="text-slate-400" />
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-linkedinBlue/20 placeholder:text-slate-400 focus:border-linkedinBlue focus:ring"
                placeholder="safiullah"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Mail size={14} className="text-slate-400" />
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-linkedinBlue/20 placeholder:text-slate-400 focus:border-linkedinBlue focus:ring"
                placeholder="you@college.edu"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Lock size={14} className="text-slate-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-linkedinBlue/20 placeholder:text-slate-400 focus:border-linkedinBlue focus:ring"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-linkedinBlue px-3 py-2 text-sm font-medium text-white shadow-sm shadow-linkedinBlue/40 transition hover:bg-linkedinBlue/90 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? 'Creating account...' : 'Create account'}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-linkedinBlue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

