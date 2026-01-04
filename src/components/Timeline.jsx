import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Trash2, Check } from 'lucide-react';
import {
    startOfWeek,
    addDays,
    format,
    isToday,
} from 'date-fns';

/* =========================
   CONSTANTS
========================= */

const HOURS = Array.from({ length: 20 }, (_, i) => i + 7);

const COLORS = {
    Work: 'border-blue-500 bg-blue-500/20 text-blue-100',
    Personal: 'border-amber-400 bg-amber-400/20 text-amber-100',
    Family: 'border-green-500 bg-green-500/20 text-green-100',
    Travel: 'border-purple-500 bg-purple-500/20 text-purple-100',
};

/* =========================
   AUTO WEEK GENERATOR
========================= */

const generateWeekDays = (baseDate = new Date()) => {
    const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday

    return Array.from({ length: 7 }).map((_, i) => {
        const date = addDays(start, i);

        return {
            label: format(date, 'EEE'),        // Mon, Tue
            date: format(date, 'yyyy-MM-dd'),  // 2026-01-21
            day: format(date, 'dd'),           // 21
            active: isToday(date),
        };
    });
};

/* =========================
   TASK COMPONENT
========================= */

function Task({ task, setTasks }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    const handleDelete = (e) => {
        e.stopPropagation();
        setTasks(prev => prev.filter(t => t.id !== task.id));
    };

    const handleToggleDone = (e) => {
        e.stopPropagation();
        setTasks(prev =>
            prev.map(t =>
                t.id === task.id ? { ...t, done: !t.done } : t
            )
        );
    };

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            zIndex: 50,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group relative p-2 mb-1 rounded-md border-l-4 shadow-sm cursor-grab active:cursor-grabbing transition-all ${COLORS[task.category] || COLORS.Work
                } ${task.done ? 'opacity-40 grayscale' : ''}`}
        >
            <div className="flex justify-between items-start gap-2">
                <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                    {task.title}
                </span>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleToggleDone} className="hover:text-white p-0.5">
                        <Check size={12} />
                    </button>
                    <button onClick={handleDelete} className="hover:text-red-400 p-0.5">
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* =========================
   DROPPABLE CELL
========================= */

function Cell({ id, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] border-b border-r border-gray-800/50 p-1 transition-colors ${isOver ? 'bg-white/5' : ''
                }`}
        >
            {children}
        </div>
    );
}

/* =========================
   TIMELINE
========================= */

export default function Timeline({ tasks, setTasks }) {
    const DAYS = generateWeekDays(); // ✅ AUTO DAYS

    return (
        <div className="flex-1 bg-[#16161e] overflow-auto">
            {/* HEADER */}
            <div className="grid grid-cols-[80px_repeat(7,minmax(140px,1fr))] sticky top-0 bg-[#16161e] z-40 border-b border-gray-800">
                <div className="p-4" />

                {DAYS.map(d => (
                    <div
                        key={d.date}
                        className="p-4 text-center border-l border-gray-800/50"
                    >
                        <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            {d.label}
                        </span>

                        <span
                            className={`inline-flex mt-1 w-8 h-8 items-center justify-center rounded-full font-bold ${d.active
                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                : 'text-gray-400'
                                }`}
                        >
                            {d.day}
                        </span>
                    </div>
                ))}
            </div>

            {/* BODY */}
            <div className="grid grid-cols-[80px_repeat(7,minmax(140px,1fr))]">
                {HOURS.map(hour => (
                    <React.Fragment key={hour}>
                        <div className="text-[10px] font-bold text-gray-600 text-right pr-4 pt-2 border-r border-gray-800/50 h-[100px]">
                            {(hour > 12) ? `${hour - 12} PM` : `${hour} AM`}
                        </div>

                        {DAYS.map(day => (
                            <Cell key={`${day.date}-${hour}`} id={`${day.date}|${hour}`}>
                                {tasks
                                    .filter(t => t.date === day.date && t.hour === hour)
                                    .map(task => (
                                        <Task
                                            key={task.id}
                                            task={task}
                                            setTasks={setTasks}
                                        />
                                    ))}
                            </Cell>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
