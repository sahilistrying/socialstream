import React, { useState } from 'react';
import { Link2, MapPin, Settings } from 'lucide-react';
import AuraCard from './AuraCard.jsx';
import EditProfileModal from './EditProfileModal.jsx';

function Sidebar({ user, aura, isRefreshing, onRefresh, onProfileUpdated }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div className="space-y-3">
      {/* Profile Card */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="h-16 bg-gradient-to-r from-linkedinBlue via-sky-500 to-indigo-500" />
        <div className="-mt-8 flex flex-col items-center px-4 pb-4 pt-0">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-lg font-semibold text-white shadow-md">
              {user?.avatarInitial || 'U'}
            </div>
          )}
          <h2 className="mt-2 text-sm font-semibold tracking-tight text-slate-900">
            {user?.name || 'User'}
          </h2>
          <p className="mt-1 text-[12px] text-slate-500 text-center">
            {user?.headline || 'CS Student @ CVR'}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 text-center">
            Building SocialStream • Competitive Programmer
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
            <MapPin size={14} className="text-slate-400" />
            <span>Hyderabad, India</span>
          </div>

          <button className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-linkedinBlue/40 bg-linkedinBlue/10 px-3 py-1 text-[11px] font-medium text-linkedinBlue hover:bg-linkedinBlue/15">
            <Link2 size={13} />
            <span>View public profile</span>
          </button>

          <button
            className="mt-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] text-slate-500 hover:bg-slate-100"
            type="button"
            onClick={() => setIsEditingProfile(true)}
          >
            <Settings size={12} />
            Edit profile
          </button>
        </div>
      </section>

      {/* Aura Box */}
      <AuraCard aura={aura} isRefreshing={isRefreshing} onRefresh={onRefresh} />

      <EditProfileModal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        user={user}
        onProfileUpdated={onProfileUpdated}
      />
    </div>
  );
}

export default Sidebar;

