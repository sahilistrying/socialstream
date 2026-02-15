import React from 'react';
import { Image, Sparkles, Video } from 'lucide-react';
import PostCard from './PostCard.jsx';

const posts = [
  {
    id: 1,
    type: 'user',
    author: 'Safiullah',
    initials: 'S',
    subtitle: 'CS Student @ CVR • Full-stack dev',
    time: '2h ago',
    visibility: 'Connections',
    icon: 'code',
    content:
      "Wrapped up the first MVP of SocialStream's Aura system today.\n\nAura points are now awarded for:\n• Solving problems\n• Pushing code\n• Supporting others in the feed\n\nWould love feedback from anyone interested in gamifying developer growth.",
    tags: ['React', 'Vite', 'Gamification', 'DeveloperExperience'],
    metrics: { views: 1287, auraDelta: 84 },
  },
  {
    id: 2,
    type: 'system',
    author: 'SocialStream Activity',
    initials: 'SS',
    subtitle: 'Automated skill tracking',
    time: '27m ago',
    visibility: 'Network',
    icon: 'leetcode',
    content: "Safiullah solved 'Trapping Rain Water' on LeetCode (Hard).\n\n+64 Aura • 18 mins to solve • 92nd percentile runtime.",
    tags: ['LeetCode', 'Algorithms', 'TwoPointers'],
    metrics: { views: 2134, auraDelta: 64 },
  },
  {
    id: 3,
    type: 'system',
    author: 'SocialStream Activity',
    initials: 'SS',
    subtitle: 'Live repository insights',
    time: '1h ago',
    visibility: 'Public',
    icon: 'github',
    content: 'Samhith pushed 3 commits to GitHub repository `socialstream/web`.\n\n- Implemented Aura leaderboard cards\n- Added responsive 3-column layout\n- Refactored feed into modular components',
    tags: ['GitHub', 'Commits', 'Frontend'],
    metrics: { views: 987, auraDelta: 48 },
  },
];

function Feed() {
  return (
    <div className="space-y-3">
      {/* Create Post */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            S
          </div>
          <button className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-[13px] text-slate-500 hover:border-linkedinBlue/50 hover:bg-white hover:text-slate-600">
            Share what you&apos;re building or solving today...
          </button>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-1 hover:text-linkedinBlue">
              <Image size={16} />
              <span>Media</span>
            </button>
            <button className="inline-flex items-center gap-1 hover:text-linkedinBlue">
              <Video size={16} />
              <span>Stream</span>
            </button>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-linkedinBlue/5 px-2 py-1 text-[10px] text-linkedinBlue">
            <Sparkles size={14} />
            <span>Posting boosts Aura</span>
          </div>
        </div>
      </section>

      {/* Feed posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;

