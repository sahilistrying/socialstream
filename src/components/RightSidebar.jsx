import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CalendarClock, ChevronRight, Trophy } from 'lucide-react';

const leaderboard = [
  {
    id: 1,
    name: 'Safiullah',
    handle: '@safiullah',
    aura: 4203,
    streak: 12,
    rankDelta: '+2 today',
  },
  {
    id: 2,
    name: 'Samhith',
    handle: '@samhith',
    aura: 3870,
    streak: 9,
    rankDelta: '+1 today',
  },
  {
    id: 3,
    name: 'BalaKrishna',
    handle: '@Balakrik',
    aura: 6969,
    streak: 69,
    rankDelta: '—',
  },
];

const contests = [
  {
    id: 1,
    title: 'Codeforces Round #980 (Div. 2)',
    platform: 'Codeforces',
    time: 'Today • 7:30 PM IST',
    auraReward: '+120 Aura for top 25%',
  },
  {
    id: 2,
    title: 'LeetCode Weekly Contest 420',
    platform: 'LeetCode',
    time: 'Sunday • 8:00 AM IST',
    auraReward: '+80 Aura for 4+ solves',
  },
];

function RightSidebar() {
  return (
    <div className="space-y-3">
      {/* Community Leaderboard */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-rose-300 text-slate-900">
              <Trophy size={14} />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold tracking-tight text-slate-900">
                Community Leaderboard
              </h3>
              <p className="text-[11px] text-slate-500">Top CVR students by Aura</p>
            </div>
          </div>
          <Link
            to="/leaderboard"
            className="text-[11px] font-medium text-linkedinBlue hover:underline"
          >
            View full leaderboard
          </Link>
        </header>

        <ul className="divide-y divide-slate-100">
          {leaderboard.map((user, index) => (
            <li key={user.id} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                  {user.name[0]}
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium text-slate-900">{user.name}</span>
                    {index === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        <Award size={11} />
                        #1
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{user.handle}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Streak: <span className="font-medium text-slate-600">{user.streak} days</span> •{' '}
                    <span className="text-emerald-500">{user.rankDelta}</span>
                  </p>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <p className="font-semibold text-slate-900">{user.aura.toLocaleString()} Aura</p>
                <p className="text-[10px] text-slate-400">Today&apos;s top {index + 1}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Upcoming Contests */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-white">
              <CalendarClock size={14} />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold tracking-tight text-slate-900">
                Upcoming Contests
              </h3>
              <p className="text-[11px] text-slate-500">Compete to multiply Aura</p>
            </div>
          </div>
        </header>

        <ul className="divide-y divide-slate-100">
          {contests.map((contest) => (
            <li key={contest.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[12px] font-medium text-slate-900">{contest.title}</p>
                  <p className="text-[11px] text-slate-500">{contest.platform}</p>
                  <p className="mt-0.5 text-[11px] text-slate-600">{contest.time}</p>
                  <p className="mt-1 text-[11px] text-emerald-600">{contest.auraReward}</p>
                </div>
                <button className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-linkedinBlue/40 bg-linkedinBlue/5 px-2 py-1 text-[10px] font-medium text-linkedinBlue hover:bg-linkedinBlue/10">
                  <span>Set reminder</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default RightSidebar;

