import React from 'react';
import { Flame, Medal, Target, RotateCcw } from 'lucide-react';

function AuraCard({ aura, isRefreshing, onRefresh }) {
  const level = aura?.level || 1;
  const progress = aura?.progress || 0;
  const totalAura = aura?.totalAura || 0;
  const rankTitle = aura?.rankTitle || 'Novice';
  const globalRank = aura?.globalRank || 0;
  const streak = aura?.streak || 0;

  const auraStats = [
    {
      id: 'rank',
      label: 'Global Rank',
      value: globalRank > 0 ? `#${globalRank.toLocaleString()}` : 'Unranked',
      icon: Medal,
    },
    {
      id: 'streak',
      label: 'Daily Streak',
      value: `🔥 ${streak}`,
      icon: Flame,
    },
    {
      id: 'quest',
      label: "Today's Quest",
      value: 'Review 3 PRs',
      icon: Target,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-800/60 bg-slate-950/80 p-4 text-slate-50 shadow-aura-glow">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.28),transparent_55%),radial-gradient(circle_at_bottom,_rgba(147,51,234,0.55),transparent_55%)]" />

      <div className="relative space-y-4">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200/80">
                Aura Core
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Your developer reputation across SocialStream
              </p>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/40 bg-amber-400/10 text-amber-100 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Refresh Aura"
            >
              <RotateCcw
                size={14}
                className={isRefreshing ? 'animate-spin' : ''}
              />
            </button>
          </div>
          <div className="rounded-lg border border-amber-300/50 bg-amber-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
            Level {level} {rankTitle}
          </div>
        </header>

        {/* Total Aura */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-300">Total Aura</p>
            <p className="mt-1 bg-gradient-to-r from-amber-200 via-yellow-300 to-fuchsia-300 bg-clip-text text-3xl font-semibold text-transparent drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]">
              {totalAura.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">+142 today</p>
          </div>
          <div className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-3 py-2 text-right text-xs text-violet-100">
            <p className="text-[10px] uppercase tracking-[0.16em]">Aura Boost</p>
            <p className="mt-0.5 text-[11px]">Complete 1 quest to multiply XP</p>
          </div>
        </div>

        {/* Stats list */}
        <div className="mt-1 grid grid-cols-1 gap-1.5">
          {auraStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.id}
                className="group flex items-center justify-between rounded-lg border border-slate-700/80 bg-slate-900/60 px-2.5 py-2 text-left text-xs text-slate-200 transition hover:border-amber-300/70 hover:bg-slate-900/90"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800/90 text-amber-200 shadow-inner shadow-black/40 group-hover:bg-slate-700">
                    <Icon size={14} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[11px] font-medium">{stat.label}</p>
                    <p className="text-[10px] text-slate-400">View details</p>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-amber-200 group-hover:text-amber-100">
                  {stat.value}
                </p>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <p>Next Level</p>
            <p className="text-amber-200">
              {progress}% to Level {level + 1}
            </p>
          </div>
          <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full bg-aura-gradient transition-all"
              style={{ width: `${progress}%` }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,250,250,0.30),transparent_55%)] mix-blend-screen" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuraCard;

