import React, { useState, useRef, useCallback } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { Task, Status, SortConfig } from '../../types';
import { formatDueDate, getInitials, isOverdue, isDueToday, priorityColor, priorityOrder } from '../../utils/dateUtils';
import { useCollaboration } from '../../hooks/useCollaboration';

const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const ROW_HEIGHT = 56;
const BUFFER = 5;
const CONTAINER_HEIGHT = 600;

function sortTasks(tasks: Task[], sort: SortConfig): Task[] {
  return [...tasks].sort((a, b) => {
    let cmp = 0;
    if (sort.key === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else if (sort.key === 'priority') {
      cmp = priorityOrder(a.priority) - priorityOrder(b.priority);
    } else if (sort.key === 'dueDate') {
      cmp = a.dueDate.localeCompare(b.dueDate);
    }
    return sort.direction === 'asc' ? cmp : -cmp;
  });
}

export default function ListView() {
  const { getFilteredTasks, updateTaskStatus, sort, setSort, clearFilters } = useTaskStore();
  const { usersByTaskId } = useCollaboration();
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const allTasks = sortTasks(getFilteredTasks(), sort);
  const totalCount = allTasks.length;
  const totalHeight = totalCount * ROW_HEIGHT;

  const visibleCount = Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + BUFFER * 2);
  const offsetY = startIndex * ROW_HEIGHT;

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const handleSort = (key: SortConfig['key']) => {
    if (sort.key === key) {
      setSort({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key, direction: 'asc' });
    }
  };

  const SortIcon = ({ col }: { col: SortConfig['key'] }) => {
    if (sort.key !== col) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return (
      <span className="text-indigo-600 ml-1">
        {sort.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const visibleTasks = allTasks.slice(startIndex, endIndex + 1);

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="bg-gray-50 border border-gray-200 rounded-t-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
          <div className="col-span-4 flex items-center">
            <button
              onClick={() => handleSort('title')}
              className={`flex items-center hover:text-indigo-600 transition-colors ${sort.key === 'title' ? 'text-indigo-600' : ''}`}
            >
              Title <SortIcon col="title" />
            </button>
          </div>
          <div className="col-span-2 flex items-center">
            <button
              onClick={() => handleSort('priority')}
              className={`flex items-center hover:text-indigo-600 transition-colors ${sort.key === 'priority' ? 'text-indigo-600' : ''}`}
            >
              Priority <SortIcon col="priority" />
            </button>
          </div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 flex items-center">
            <button
              onClick={() => handleSort('dueDate')}
              className={`flex items-center hover:text-indigo-600 transition-colors ${sort.key === 'dueDate' ? 'text-indigo-600' : ''}`}
            >
              Due Date <SortIcon col="dueDate" />
            </button>
          </div>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white border border-t-0 border-gray-200 rounded-b-xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-semibold text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="overflow-y-auto border border-t-0 border-gray-200 rounded-b-xl bg-white"
          style={{ height: CONTAINER_HEIGHT }}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleTasks.map((task) => {
                const overdue = isOverdue(task.dueDate) && task.status !== 'Done';
                const dueToday = isDueToday(task.dueDate);
                const collabUsers = usersByTaskId[task.id] || [];

                return (
                  <div
                    key={task.id}
                    className="grid grid-cols-12 gap-2 px-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <div className="col-span-4 flex items-center gap-2 min-w-0">
                      {collabUsers.length > 0 && (
                        <div className="flex -space-x-1 shrink-0">
                          {collabUsers.slice(0, 2).map((u) => (
                            <div
                              key={u.id}
                              title={u.name}
                              className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: u.color, fontSize: '8px' }}
                            >
                              {getInitials(u.name)}
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="text-sm text-gray-800 truncate font-medium">{task.title}</span>
                    </div>

                    <div className="col-span-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: task.assignee.color }}
                        title={task.assignee.name}
                      >
                        {getInitials(task.assignee.name)}
                      </div>
                      <span className="text-sm text-gray-600 truncate hidden md:block">
                        {task.assignee.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`text-xs font-medium ${
                          overdue ? 'text-red-600' : dueToday ? 'text-orange-500' : 'text-gray-500'
                        }`}
                      >
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {totalCount > 0 && (
        <div className="mt-2 text-xs text-gray-400 text-right">
          Showing {totalCount} task{totalCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}