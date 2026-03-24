import React, { useState, useRef } from 'react';
import { Status } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useCollaboration } from '../../hooks/useCollaboration';
import KanbanColumn from './KanbanColumn';

const STATUSES: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export default function KanbanBoard() {
  const { getFilteredTasks, moveTask } = useTaskStore();
  const { usersByTaskId } = useCollaboration();

  const [dragOverStatus, setDragOverStatus] = useState<Status | null>(null);
  const dragTaskId = useRef<string | null>(null);
  const dragOriginStatus = useRef<Status | null>(null);

  const tasks = getFilteredTasks();

  const tasksByStatus = (status: Status) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    dragTaskId.current = taskId;
    const task = tasks.find((t) => t.id === taskId);
    dragOriginStatus.current = task?.status ?? null;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    const el = e.currentTarget as HTMLElement;
    setTimeout(() => {
      el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = dragTaskId.current;
    if (taskId) {
      moveTask(taskId, status);
    }
    setDragOverStatus(null);
    dragTaskId.current = null;
    dragOriginStatus.current = null;
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto h-full">
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus(status)}
          usersByTaskId={usersByTaskId}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          isDragOver={dragOverStatus === status}
          dragOverStatus={dragOverStatus}
        />
      ))}
    </div>
  );
}