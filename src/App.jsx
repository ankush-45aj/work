import React, { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Weekly planning', date: '2026-01-21', hour: 9, category: 'Work', done: false },
    { id: '2', title: 'TestFlight submission', date: '2026-01-22', hour: 10, category: 'Work', done: false },
  ]);

  // Necessary sensors to allow clicking icons without triggering drag immediately
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Task only drags after moving 5px
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const [newDate, newHour] = over.id.split('|');

    setTasks(prev => prev.map(task =>
      task.id === active.id
        ? { ...task, date: newDate, hour: parseInt(newHour) }
        : task
    ));
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] text-gray-200 overflow-hidden">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <Sidebar tasks={tasks} setTasks={setTasks} />
        <Timeline tasks={tasks} setTasks={setTasks} />
      </DndContext>
    </div>
  );
}