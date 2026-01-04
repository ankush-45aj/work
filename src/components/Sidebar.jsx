import React from 'react';
import { Plus, Inbox, Clock } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['Work', 'Personal', 'Family', 'Travel'];

export default function Sidebar({ tasks, setTasks }) {

    const addTask = () => {
        const title = prompt('Task title');
        if (!title) return;

        const today = format(new Date(), 'yyyy-MM-dd');

        setTasks(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                title,
                date: today,
                hour: 10,
                category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
                done: false,
            },
        ]);
    };

    return (
        <aside
            className="
        shrink-0
        w-14 md:w-64
        border-r border-gray-800
        bg-[#0f0f13]
        flex flex-col
        overflow-y-auto
      "
        >
            {/* TITLE */}
            <h2 className="hidden md:block text-xl font-bold p-5 text-white">
                Tasks
            </h2>

            {/* ICON TITLE (MOBILE) */}
            <h2 className="md:hidden text-center py-4 font-bold text-white">
                📋
            </h2>

            {/* STATS */}
            <div className="space-y-4 px-3 md:px-5 mb-8 text-sm text-gray-400">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        <Inbox size={16} />
                        <span className="hidden md:inline">Inbox</span>
                    </span>
                    <span className="hidden md:inline">{tasks.length}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="hidden md:inline">Overdue</span>
                    </span>
                    <span className="hidden md:inline">0</span>
                </div>
            </div>

            {/* ADD BUTTON */}
            <button
                onClick={addTask}
                className="
          mt-auto m-3
          flex items-center justify-center gap-2
          bg-white/5 hover:bg-white/10
          text-white py-2 rounded-lg
          border border-white/10
          transition
        "
            >
                <Plus size={16} />
                <span className="hidden md:inline">Add Task</span>
            </button>
        </aside>
    );
}
