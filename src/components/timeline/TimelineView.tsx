import React, { useRef } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { priorityBarColor, getInitials } from '../../utils/dateUtils';

const ROW_HEIGHT = 44;
const DAY_WIDTH = 38;
const LABEL_WIDTH = 200;

export default function TimelineView() {
  const { getFilteredTasks, clearFilters } = useTaskStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDay = today.getDate(); 

  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const tasks = getFilteredTasks();

  const monthStart = new Date(year, month, 1).toISOString().split('T')[0];
  const monthEnd = new Date(year, month, daysInMonth).toISOString().split('T')[0];

  const visibleTasks = tasks.filter((t) => {
    const start = t.startDate || t.dueDate;
    return t.dueDate >= monthStart && start <= monthEnd;
  });

  const getBarStyle = (startDate: string | undefined, dueDate: string) => {
    const effectiveStart = startDate || dueDate;

    const startDay = Math.max(
      1,
      Math.min(
        daysInMonth,
        new Date(effectiveStart).getDate()
      )
    );
    const endDay = Math.max(
      1,
      Math.min(
        daysInMonth,
        new Date(dueDate).getDate()
      )
    );

    const isSingleDay = !startDate || startDate === dueDate;
    const left = (startDay - 1) * DAY_WIDTH;
    const width = isSingleDay
      ? DAY_WIDTH
      : Math.max(DAY_WIDTH, (endDay - startDay + 1) * DAY_WIDTH);

    return { left, width, isSingleDay };
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-base font-bold text-gray-700 mb-3">{monthLabel}</h2>

      {visibleTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500 font-semibold text-lg">No tasks this month</p>
          <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="shrink-0 border-r border-gray-200 z-10 bg-white" style={{ width: LABEL_WIDTH }}>
            <div
              className="flex items-center px-3 bg-gray-50 border-b border-gray-200 font-semibold text-xs text-gray-500 uppercase tracking-wide"
              style={{ height: ROW_HEIGHT }}
            >
              Task
            </div>
            {visibleTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 px-3 border-b border-gray-100 hover:bg-gray-50"
                style={{ height: ROW_HEIGHT }}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: task.assignee.color }}
                >
                  {getInitials(task.assignee.name)}
                </div>
                <span className="text-xs text-gray-700 truncate">{task.title}</span>
              </div>
            ))}
          </div>

          <div ref={scrollRef} className="overflow-x-auto flex-1">
            <div style={{ width: daysInMonth * DAY_WIDTH, minWidth: '100%' }}>
              <div
                className="flex bg-gray-50 border-b border-gray-200 sticky top-0"
                style={{ height: ROW_HEIGHT }}
              >
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isToday = day === todayDay;
                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-center text-xs font-medium border-r border-gray-100 shrink-0 ${
                        isToday ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-500'
                      }`}
                      style={{ width: DAY_WIDTH, height: ROW_HEIGHT }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {visibleTasks.map((task) => {
                const { left, width, isSingleDay } = getBarStyle(task.startDate, task.dueDate);
                const color = priorityBarColor(task.priority);

                return (
                  <div
                    key={task.id}
                    className="relative border-b border-gray-100 hover:bg-gray-50"
                    style={{ height: ROW_HEIGHT, width: daysInMonth * DAY_WIDTH }}
                  >
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-r border-gray-100"
                        style={{ left: (i + 1) * DAY_WIDTH }}
                      />
                    ))}

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-10"
                      style={{ left: (todayDay - 1) * DAY_WIDTH + DAY_WIDTH / 2 }}
                    />

                    <div
                      title={`${task.title} (${task.priority})`}
                      className="absolute top-2.5 rounded-md flex items-center px-2 text-white text-xs font-medium overflow-hidden whitespace-nowrap cursor-pointer hover:brightness-90 transition-all"
                      style={{
                        left: left + 2,
                        width: width - 4,
                        height: ROW_HEIGHT - 20,
                        backgroundColor: color,
                        minWidth: isSingleDay ? DAY_WIDTH - 4 : undefined,
                      }}
                    >
                      {!isSingleDay && width > 60 && (
                        <span className="truncate">{task.title}</span>
                      )}
                      {isSingleDay && (
                        <span className="w-full text-center">•</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}