import { useState, useEffect, useMemo } from 'react';
import { CollabUser } from '../types';
import { INITIAL_TASKS } from '../data/seed';

const COLLAB_USERS: CollabUser[] = [
  { id: 'c1', name: 'Sara K', color: '#f43f5e', currentTaskId: null },
  { id: 'c2', name: 'Mike T', color: '#3b82f6', currentTaskId: null },
  { id: 'c3', name: 'Nina R', color: '#a855f7', currentTaskId: null },
  { id: 'c4', name: 'Omar L', color: '#f97316', currentTaskId: null },
];

export function useCollaboration() {
  const [collabUsers, setCollabUsers] = useState<CollabUser[]>(COLLAB_USERS);

  useEffect(() => {
    const taskIds = INITIAL_TASKS.slice(0, 50).map((t) => t.id);

    setCollabUsers((users) =>
      users.map((u) => ({
        ...u,
        currentTaskId: taskIds[Math.floor(Math.random() * taskIds.length)],
      }))
    );

    const interval = setInterval(() => {
      setCollabUsers((users) =>
        users.map((u) => {
          if (Math.random() < 0.2) {
            const newTaskId = taskIds[Math.floor(Math.random() * taskIds.length)];
            return { ...u, currentTaskId: newTaskId };
          }
          return u;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const usersByTaskId = useMemo(() => {
    const map: Record<string, CollabUser[]> = {};
    collabUsers.forEach((u) => {
      if (u.currentTaskId) {
        if (!map[u.currentTaskId]) {
          map[u.currentTaskId] = [];
        }
        map[u.currentTaskId].push(u);
      }
    });
    return map;
  }, [collabUsers]);

  const activeCount = useMemo(
    () => collabUsers.filter((u) => u.currentTaskId !== null).length,
    [collabUsers]
  );

  return { collabUsers, usersByTaskId, activeCount };
}