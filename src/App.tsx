import React, { JSX, useMemo, lazy, Suspense } from 'react';
import { useTaskStore } from './store/taskStore';
import { useUrlFilters } from './hooks/useUrlFilters';
import { useCollaboration } from './hooks/useCollaboration';
import FilterBar from './components/filters/FilterBar';
import CollabBar from './components/collaboration/CollabBar';
import { ViewType } from './types';

const KanbanBoard = lazy(() => import('./components/kanban/KanbanBoard'));
const ListView = lazy(() => import('./components/list/ListView'));
const TimelineView = lazy(() => import('./components/timeline/TimelineView'));

const VIEW_LABELS: { key: ViewType; label: string; icon: JSX.Element }[] = [
  {
    key: 'kanban',
    label: 'Kanban',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
      </svg>
    ),
  },
  {
    key: 'list',
    label: 'List',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    key: 'timeline',
    label: 'Timeline',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function App() {
  const { view, setView, getFilteredTasks } = useTaskStore();
  const { collabUsers, activeCount } = useCollaboration();
  useUrlFilters();

  const filteredTasks = useMemo(() => getFilteredTasks(), [getFilteredTasks]);
  const totalTasks = filteredTasks.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f1f5f9' }}>
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight tracking-tight">Project Tracker</h1>
            <p className="text-xs text-gray-400 leading-tight">Velozity Global Solutions</p>
          </div>
          <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
            {totalTasks} tasks
          </span>
        </div>

        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
          {VIEW_LABELS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                view === key
                  ? 'bg-white text-indigo-600 shadow border border-indigo-100'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </header>

      <CollabBar users={collabUsers} activeCount={activeCount} />
      <FilterBar />

      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="p-4 text-center text-gray-500">Loading view...</div>}>
          {view === 'kanban' && <KanbanBoard />}
          {view === 'list' && <ListView />}
          {view === 'timeline' && <TimelineView />}
        </Suspense>
      </main>
    </div>
  );
}