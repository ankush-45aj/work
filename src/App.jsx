import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay, // New Import
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';

// Optional: Custom styling for the item while it's being dragged
const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Weekly planning', date: '2026-01-21', hour: 9, category: 'Work', done: false },
    { id: '2', title: 'TestFlight submission', date: '2026-01-22', hour: 10, category: 'Work', done: false },
  ]);

  // Track the active task for the Overlay
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null); // Clear active task

    if (!over) return;

    const [newDate, newHour] = over.id.split('|');

    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id
          ? { ...task, date: newDate, hour: parseInt(newHour, 10) }
          : task
      )
    );
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] text-gray-200 overflow-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Sidebar tasks={tasks} setTasks={setTasks} />
        <Timeline tasks={tasks} setTasks={setTasks} />

        {/* The Overlay: This renders the "ghost" task that follows your finger */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <div className={`p-2 rounded-md border-l-4 shadow-2xl opacity-90 scale-105 bg-[#1e1e2e] border-blue-500 text-blue-100`}>
              <span className="text-[11px] font-semibold">{activeTask.title}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}