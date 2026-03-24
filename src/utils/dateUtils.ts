export function isOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

export function isDueToday(dueDate: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dueDate === today;
}

export function daysOverdue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diff = today.getTime() - due.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatDueDate(dueDate: string): string {
  if (isDueToday(dueDate)) return 'Due Today';
  const days = daysOverdue(dueDate);
  if (days > 7) return `${days} days overdue`;
  return new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function priorityOrder(priority: string): number {
  const order: Record<string, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };
  return order[priority] ?? 99;
}

export function priorityColor(priority: string): string {
  const colors: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700 border border-red-300',
    High: 'bg-orange-100 text-orange-700 border border-orange-300',
    Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    Low: 'bg-green-100 text-green-700 border border-green-300',
  };
  return colors[priority] ?? 'bg-gray-100 text-gray-700';
}

export function priorityBarColor(priority: string): string {
  const colors: Record<string, string> = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e',
  };
  return colors[priority] ?? '#6b7280';
}