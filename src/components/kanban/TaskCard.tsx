import React, { memo } from 'react';
import { Task, CollabUser } from '../../types';
import { formatDueDate, getInitials, isOverdue, isDueToday, priorityColor } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  collabUsers: CollabUser[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

const PRIORITY_LEFT_BORDER: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

function TaskCard({ task, collabUsers, onDragStart }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && task.status !== 'Done';
  const dueToday = isDueToday(task.dueDate);
  const dueDateText = formatDueDate(task.dueDate);
  const visibleUsers = collabUsers.slice(0, 2);
  const overflowCount = collabUsers.length - 2;
  const borderColor = PRIORITY_LEFT_BORDER[task.priority] || '#6b7280';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white rounded-xl border border-gray-100 p-3.5 cursor-grab active:cursor-grabbing select-none group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      {collabUsers.length > 0 && (
        <div className="flex items-center -space-x-1 mb-2">
          {visibleUsers.map((u) => (
            <div
              key={u.id}
              title={`${u.name} is viewing`}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-white font-bold transition-all duration-500"
              style={{ backgroundColor: u.color, fontSize: '9px' }}
            >
              {getInitials(u.name)}
            </div>
          ))}
          {overflowCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 border-2 border-white font-bold"
              style={{ fontSize: '9px' }}>
              +{overflowCount}
            </div>
          )}
          <span className="ml-2 text-xs text-indigo-400 font-medium">viewing</span>
        </div>
      )}

      <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
        {task.title}
      </p>

      <div className="mb-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${priorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            title={task.assignee.name}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
            style={{ backgroundColor: task.assignee.color }}
          >
            {getInitials(task.assignee.name)}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {task.assignee.name.split(' ')[0]}
          </span>
        </div>

        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          overdue
            ? 'bg-red-50 text-red-600'
            : dueToday
            ? 'bg-orange-50 text-orange-600'
            : 'bg-gray-50 text-gray-500'
        }`}>
          {overdue && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {dueDateText}
        </div>
      </div>
    </div>
  );
}

export default memo(TaskCard);