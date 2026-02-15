import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { Trophy, Crown } from 'lucide-react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUsername, setCurrentUsername] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('socialstream_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.username) {
          setCurrentUsername(parsed.username);
        }
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/users/leaderboard');
        setEntries(res.data || []);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linkedinBg">
        <p className="text-lg font-medium text-slate-600">Loading Global Leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linkedinBg px-3 py-6 text-slate-900 sm:px-4">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-rose-300 text-slate-900 shadow-sm">
                <Trophy size={22} />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                  Global Leaderboard
                </h1>
                <p className="text-xs text-slate-500">
                  Top developers ranked by Aura Points across SocialStream.
                </p>
              </div>
            </div>
            {currentUsername && (
              <div className="hidden rounded-full border border-linkedinBlue/30 bg-linkedinBlue/5 px-3 py-1.5 text-right text-[11px] text-linkedinBlue sm:block">
                <p className="font-medium">Signed in as</p>
                <p className="truncate text-xs text-slate-700">{currentUsername}</p>
              </div>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Leaderboard list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:flex">
            <div className="w-14">Rank</div>
            <div className="flex-1">User</div>
            <div className="w-28 text-right">Aura Points</div>
          </div>

          <ul className="divide-y divide-slate-100">
            {entries.map((user, index) => {
              const isCurrent = currentUsername && user.username === currentUsername;
              const rank = index + 1;

              const rowClasses = [
                'flex items-center gap-3 px-4 py-3 sm:px-5',
                isCurrent
                  ? 'bg-gradient-to-r from-sky-50 via-amber-50 to-sky-50'
                  : index < 3
                    ? 'bg-gradient-to-r from-transparent via-slate-50 to-transparent'
                    : 'bg-white',
              ].join(' ');

              return (
                <li key={user.username || index} className={rowClasses}>
                  {/* Rank */}
                  <div className="flex w-10 items-center justify-center sm:w-14">
                    {rank <= 3 ? (
                      <div
                        className={[
                          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                          rank === 1
                            ? 'bg-amber-400 text-slate-900'
                            : rank === 2
                              ? 'bg-slate-300 text-slate-900'
                              : 'bg-amber-200 text-slate-900',
                        ].join(' ')}
                      >
                        {rank}
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-500">#{rank}</span>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName || user.username}
                        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                        {(user.fullName || user.username || '?')[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {user.fullName || user.username}
                        </p>
                        {rank === 1 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            <Crown size={11} />
                            Top 1
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-slate-500">@{user.username}</p>
                      <p className="truncate text-[11px] text-slate-400">
                        {user.rankTitle || 'Novice'}
                      </p>
                    </div>
                  </div>

                  {/* Aura points */}
                  <div className="ml-auto w-24 text-right text-xs font-semibold text-slate-900 sm:w-28">
                    <span className="rounded-full bg-slate-50 px-2 py-1 text-[11px] text-slate-700">
                      {user.auraPoints?.toLocaleString?.() ?? user.auraPoints ?? 0} Aura
                    </span>
                  </div>
                </li>
              );
            })}

            {entries.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-slate-500">
                No users found yet. Start solving, committing, and competing to appear here.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Leaderboard;

