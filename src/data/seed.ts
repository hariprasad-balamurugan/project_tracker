import { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', color: '#6366f1' },
  { id: 'u2', name: 'Bob Smith', color: '#f59e0b' },
  { id: 'u3', name: 'Carol White', color: '#10b981' },
  { id: 'u4', name: 'David Brown', color: '#ef4444' },
  { id: 'u5', name: 'Eva Martinez', color: '#8b5cf6' },
  { id: 'u6', name: 'Frank Lee', color: '#06b6d4' },
];

const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const TASK_TITLES = [
  'Design landing page mockup',
  'Fix login authentication bug',
  'Write unit tests for API',
  'Update database schema',
  'Implement search feature',
  'Refactor payment module',
  'Create onboarding flow',
  'Optimize image loading',
  'Set up CI/CD pipeline',
  'Review pull requests',
  'Build notification system',
  'Add dark mode support',
  'Fix mobile responsiveness',
  'Integrate third-party API',
  'Write documentation',
  'Conduct code review',
  'Deploy to staging server',
  'Perform security audit',
  'Update dependencies',
  'Create admin dashboard',
  'Build analytics module',
  'Fix memory leak issue',
  'Add export to CSV feature',
  'Implement role-based access',
  'Set up monitoring alerts',
  'Create email templates',
  'Optimize SQL queries',
  'Add pagination support',
  'Implement file upload',
  'Write integration tests',
  'Fix cross-browser issues',
  'Add keyboard shortcuts',
  'Implement undo/redo',
  'Create data visualizations',
  'Set up error tracking',
  'Add multi-language support',
  'Implement offline mode',
  'Build reporting feature',
  'Fix performance bottleneck',
  'Add two-factor authentication',
  'Create API rate limiting',
  'Implement webhooks',
  'Add audit logging',
  'Build user settings page',
  'Fix date timezone issues',
  'Implement caching layer',
  'Add social login',
  'Create backup system',
  'Build chat feature',
  'Fix drag-and-drop bugs',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0];
}

export function generateTasks(count: number = 500): Task[] {
  const today = new Date();
  const pastStart = new Date(today);
  pastStart.setMonth(today.getMonth() - 3);
  const futureEnd = new Date(today);
  futureEnd.setMonth(today.getMonth() + 2);

  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const dueDate = randomDate(pastStart, futureEnd);
    const hasStartDate = Math.random() > 0.15;
    const startDate = hasStartDate
      ? randomDate(pastStart, new Date(dueDate))
      : undefined;

    const titleBase = randomItem(TASK_TITLES);
    const suffix = Math.floor(Math.random() * 999) + 1;

    tasks.push({
      id: `task-${i + 1}`,
      title: `${titleBase} #${suffix}`,
      assignee: randomItem(USERS),
      priority: randomItem(PRIORITIES),
      status: randomItem(STATUSES),
      startDate,
      dueDate,
    });
  }
  for (let i = 0; i < 50; i++) {
    const overdueDate = new Date(today);
    overdueDate.setDate(today.getDate() - Math.floor(Math.random() * 30 + 8));
    tasks[i].dueDate = overdueDate.toISOString().split('T')[0];
    tasks[i].status = randomItem(['To Do', 'In Progress', 'In Review']);
  }
  for (let i = 50; i < 60; i++) {
    tasks[i].dueDate = today.toISOString().split('T')[0];
    tasks[i].status = randomItem(['To Do', 'In Progress']);
  }

  return tasks;
}

export const INITIAL_TASKS = generateTasks(500);