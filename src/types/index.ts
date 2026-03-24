export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: User;
  priority: Priority;
  status: Status;
  startDate?: string; 
  dueDate: string;    
}

export interface FilterState {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

export interface SortConfig {
  key: 'title' | 'priority' | 'dueDate';
  direction: 'asc' | 'desc';
}

export type ViewType = 'kanban' | 'list' | 'timeline';

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  currentTaskId: string | null;
}