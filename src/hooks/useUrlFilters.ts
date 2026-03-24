import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import {Status, Priority } from '../types';

export function useUrlFilters() {
  const { filters, setFilters, setView, view } = useTaskStore();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const status = params.get('status')
      ? (params.get('status')!.split(',') as Status[])
      : [];
    const priority = params.get('priority')
      ? (params.get('priority')!.split(',') as Priority[])
      : [];
    const assignee = params.get('assignee')
      ? params.get('assignee')!.split(',')
      : [];
    const dueDateFrom = params.get('dueDateFrom') || '';
    const dueDateTo = params.get('dueDateTo') || '';
    const viewParam = params.get('view');

    if (viewParam === 'kanban' || viewParam === 'list' || viewParam === 'timeline') {
      setView(viewParam);
    }

    setFilters({ status, priority, assignee, dueDateFrom, dueDateTo });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.status.length > 0) params.set('status', filters.status.join(','));
    if (filters.priority.length > 0) params.set('priority', filters.priority.join(','));
    if (filters.assignee.length > 0) params.set('assignee', filters.assignee.join(','));
    if (filters.dueDateFrom) params.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) params.set('dueDateTo', filters.dueDateTo);
    if (view) params.set('view', view);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [filters, view]);

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    !!filters.dueDateFrom ||
    !!filters.dueDateTo;

  return { hasActiveFilters };
}