import React from 'react';
import { Code2, GitCommit, MessageCircle, Repeat2, ThumbsUp } from 'lucide-react';

function PostCard({ post }) {
  const isSystem = post.type === 'system';

  return (
    <article
      className={[
        'overflow-hidden rounded-xl border bg-white text-sm',
        isSystem ? 'border-violet-300/70 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50' : 'border-slate-200',
      ].join(' ')}
    >
      <div className={isSystem ? 'border-b border-violet-500/40 px-4 py-3' : 'border-b border-slate-100 px-4 py-3'}>
        <div className="flex items-start gap-3">
          <div
            className={[
              'flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold',
              isSystem
                ? 'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-slate-950'
                : 'bg-slate-900 text-white',
            ].join(' ')}
          >
            {post.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[13px] font-semibold tracking-tight">
                {post.author}
              </h3>
              {isSystem && (
                <span className="rounded-full border border-violet-400/60 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-100">
                  System
                </span>
              )}
            </div>
            <p className={isSystem ? 'text-[11px] text-violet-100/80' : 'text-[11px] text-slate-500'}>
              {post.subtitle}
            </p>
            <p className={isSystem ? 'mt-1 text-[11px] text-violet-200/80' : 'mt-1 text-[11px] text-slate-400'}>
              {post.time} • {post.visibility}
            </p>
          </div>
        </div>
      </div>

      <div className={isSystem ? 'px-4 pb-3 pt-2 text-[13px] text-slate-50' : 'px-4 pb-3 pt-2 text-[13px] text-slate-800'}>
        {post.icon === 'code' && (
          <div className="mb-1 flex items-center gap-1.5 text-[11px] text-linkedinBlue">
            <Code2 size={14} />
            <span className="font-medium">Project Update</span>
          </div>
        )}
        {post.icon === 'leetcode' && (
          <div className="mb-1 flex items-center gap-1.5 text-[11px] text-amber-300">
            <Code2 size={14} />
            <span className="font-medium">LeetCode</span>
          </div>
        )}
        {post.icon === 'github' && (
          <div className="mb-1 flex items-center gap-1.5 text-[11px] text-emerald-300">
            <GitCommit size={14} />
            <span className="font-medium">GitHub Activity</span>
          </div>
        )}
        <p className="whitespace-pre-line">{post.content}</p>

        {post.tags?.length > 0 && (
          <div className={isSystem ? 'mt-2 flex flex-wrap gap-1.5 text-[11px]' : 'mt-2 flex flex-wrap gap-1.5 text-[11px]'}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={
                  isSystem
                    ? 'rounded-full bg-slate-800/80 px-2 py-0.5 text-violet-100'
                    : 'rounded-full bg-slate-100 px-2 py-0.5 text-slate-600'
                }
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <footer
        className={
          isSystem
            ? 'flex items-center justify-between border-t border-violet-500/40 bg-slate-950/60 px-3.5 py-2.5 text-[11px] text-slate-200'
            : 'flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-500'
        }
      >
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center gap-1 hover:text-linkedinBlue">
            <ThumbsUp size={14} />
            <span>Like</span>
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
        <div className="text-[10px] text-slate-400">
          {post.metrics.views.toLocaleString()} views • {post.metrics.auraDelta > 0 ? '+' : ''}
          {post.metrics.auraDelta} Aura
        </div>
      </footer>
    </article>
  );
}

export default PostCard;

