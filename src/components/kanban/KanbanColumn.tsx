import React, { JSX, memo } from 'react';
import { Task, Status, CollabUser } from '../../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  usersByTaskId: Record<string, CollabUser[]>;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent, status: Status) => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
  onDragLeave: () => void;
  isDragOver: boolean;
  dragOverStatus: Status | null;
}

const COLUMN_CONFIG: Record<Status, { top: string; badge: string; icon: JSX.Element; bg: string }> = {
  'To Do': {
    top: '#94a3b8',
    badge: 'bg-slate-100 text-slate-600 border border-slate-200',
    bg: 'from-slate-50 to-white',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  'In Progress': {
    top: '#3b82f6',
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    bg: 'from-blue-50/40 to-white',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  'In Review': {
    top: '#f59e0b',
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    bg: 'from-amber-50/40 to-white',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  'Done': {
    top: '#22c55e',
    badge: 'bg-green-100 text-green-700 border border-green-200',
    bg: 'from-green-50/40 to-white',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
};

function KanbanColumn({
  status,
  tasks,
  usersByTaskId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  isDragOver,
}: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div
      className={`flex flex-col rounded-2xl min-w-[270px] w-full flex-1 border border-gray-200 overflow-hidden transition-all duration-200 ${
        isDragOver ? 'border-indigo-400 shadow-lg shadow-indigo-100' : ''
      }`}
      style={{
        background: 'white',
        boxShadow: isDragOver
          ? '0 8px 32px rgba(99,102,241,0.15)'
          : '0 2px 12px rgba(0,0,0,0.05)',
      }}
      onDragOver={(e) => onDragOver(e, status)}
      onDrop={(e) => onDrop(e, status)}
      onDragLeave={onDragLeave}
    >
      <div className="h-1 w-full rounded-t-2xl" style={{ background: config.top }} />

      <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-b ${config.bg} border-b border-gray-100`}>
        <div className="flex items-center gap-2">
          <span style={{ color: config.top }}>{config.icon}</span>
          <h3 className="font-bold text-gray-700 text-sm tracking-tight">{status}</h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${config.badge}`}>
          {tasks.length}
        </span>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 transition-all duration-200 min-h-[200px] max-h-[calc(100vh-290px)] ${
          isDragOver ? 'bg-indigo-50/60' : 'bg-gray-50/40'
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-center rounded-xl border-2 border-dashed border-gray-200 m-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ background: `${config.top}18` }}>
              <span style={{ color: config.top }}>{config.icon}</span>
            </div>
            <p className="text-sm text-gray-400 font-semibold">No tasks</p>
            <p className="text-xs text-gray-300 mt-0.5">Drop a card here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              collabUsers={usersByTaskId[task.id] || []}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default memo(KanbanColumn);
