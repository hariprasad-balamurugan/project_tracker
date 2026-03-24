import React, { useState, useRef, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { USERS } from '../../data/seed';
import { Status, Priority } from '../../types';

const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

const STATUS_COLORS: Record<string, string> = {
  'To Do': 'bg-gray-400',
  'In Progress': 'bg-blue-500',
  'In Review': 'bg-yellow-500',
  'Done': 'bg-green-500',
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-400',
  Low: 'bg-green-500',
};

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string; dot?: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 border ${
          selected.length > 0
            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
            : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
        style={{ minWidth: 110 }}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {selected.length}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 ml-auto transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          style={{ minWidth: 170 }}>
          {options.map((opt) => (
            <label key={opt.value}
              className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-indigo-50 cursor-pointer text-sm transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="rounded border-gray-300 text-indigo-600 w-4 h-4"
              />
              {opt.dot && <span className={`w-2 h-2 rounded-full ${opt.dot}`} />}
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const { filters, setFilters, clearFilters } = useTaskStore();

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    !!filters.dueDateFrom ||
    !!filters.dueDateTo;

  return (
    <div className="flex flex-wrap items-center gap-2.5 px-6 py-3 bg-white border-b border-gray-200"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-1.5 mr-1">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters</span>
      </div>

      <MultiSelect
        label="Status"
        options={STATUSES.map((s) => ({ value: s, label: s, dot: STATUS_COLORS[s] }))}
        selected={filters.status}
        onChange={(v) => setFilters({ status: v as Status[] })}
      />

      <MultiSelect
        label="Priority"
        options={PRIORITIES.map((p) => ({ value: p, label: p, dot: PRIORITY_COLORS[p] }))}
        selected={filters.priority}
        onChange={(v) => setFilters({ priority: v as Priority[] })}
      />

      <MultiSelect
        label="Assignee"
        options={USERS.map((u) => ({ value: u.id, label: u.name }))}
        selected={filters.assignee}
        onChange={(v) => setFilters({ assignee: v })}
      />

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 hover:border-indigo-300 transition-colors">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs text-gray-400 font-medium">From</span>
        <input
          type="date"
          value={filters.dueDateFrom}
          onChange={(e) => setFilters({ dueDateFrom: e.target.value })}
          className="text-sm text-gray-700 bg-transparent outline-none border-none w-32"
        />
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 hover:border-indigo-300 transition-colors">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs text-gray-400 font-medium">To</span>
        <input
          type="date"
          value={filters.dueDateTo}
          onChange={(e) => setFilters({ dueDateTo: e.target.value })}
          className="text-sm text-gray-700 bg-transparent outline-none border-none w-32"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors ml-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All
        </button>
      )}
    </div>
  );
}