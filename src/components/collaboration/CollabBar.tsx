import React from 'react';
import { CollabUser } from '../../types';
import { getInitials } from '../../utils/dateUtils';

interface CollabBarProps {
  users: CollabUser[];
  activeCount: number;
}

export default function CollabBar({ users, activeCount }: CollabBarProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-2.5 border-b border-indigo-100"
      style={{ background: 'linear-gradient(90deg, #eef2ff 0%, #f5f3ff 100%)' }}>
      <div className="flex items-center -space-x-2">
        {users.map((user) => (
          <div
            key={user.id}
            title={user.name}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm transition-all duration-500"
            style={{ backgroundColor: user.color }}
          >
            {getInitials(user.name)}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-indigo-700">
          {activeCount} {activeCount === 1 ? 'person is' : 'people are'} viewing this board
        </span>
      </div>
      <span className="ml-auto flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-indigo-100">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-xs font-semibold text-emerald-600">Live</span>
      </span>
    </div>
  );
}