import { create } from 'zustand';
import { Task, FilterState, SortConfig, ViewType, Status } from '../types';
import { INITIAL_TASKS } from '../data/seed';

interface TaskStore {
  tasks: Task[];
  view: ViewType;
  filters: FilterState;
  sort: SortConfig;

  setView: (view: ViewType) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSort: (sort: SortConfig) => void;
  getFilteredTasks: () => Task[];
}

const DEFAULT_FILTERS: FilterState = {
  status: [],
  priority: [],
  assignee: [],
  dueDateFrom: '',
  dueDateTo: '',
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: INITIAL_TASKS,
  view: 'kanban',
  filters: DEFAULT_FILTERS,
  sort: { key: 'dueDate', direction: 'asc' },

  setView: (view) => set({ view }),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  setSort: (sort) => set({ sort }),

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter((task) => {
      if (filters.status.length > 0 && !filters.status.includes(task.status))
        return false;
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority))
        return false;
      if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee.id))
        return false;
      if (filters.dueDateFrom && task.dueDate < filters.dueDateFrom)
        return false;
      if (filters.dueDateTo && task.dueDate > filters.dueDateTo)
        return false;
      return true;
    });
  },
}));