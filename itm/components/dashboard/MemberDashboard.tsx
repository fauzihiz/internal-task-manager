'use client';

import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { TaskStatus, Task } from '@/lib/types';
import TaskCard from '@/components/tasks/TaskCard';
import TaskModal from '@/components/tasks/TaskModal';

export default function MemberDashboard() {
    const { sortedTasks, currentUser } = useTasks();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [search, setSearch] = useState('');

    const myTasks = sortedTasks.filter(t => t.assigneeId === currentUser?.id);
    const filteredTasks = myTasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );

    const activeTasks = filteredTasks.filter(t => t.status !== TaskStatus.DONE);
    const doneTasks = filteredTasks.filter(t => t.status === TaskStatus.DONE);

    return (
        <div className="p-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Workspace</h1>
                    <p className="text-zinc-500 font-medium mt-1">Hello {currentUser?.name}, focus on your active priority list.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search my tasks..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 shadow-sm outline-none"
                    />
                    <span className="absolute left-3.5 top-3 text-zinc-400">🔍</span>
                </div>
            </header>

            {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}

            {/* Stats Summary */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-2xl p-7 shadow-xl transition-all bg-blue-600 shadow-blue-500/20">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">
                            My Active Tasks
                        </p>
                    </div>
                    <p className="text-5xl font-bold tracking-tighter text-white">{activeTasks.length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7 shadow-sm">
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Completed History</p>
                    <p className="text-5xl font-bold tracking-tighter">{doneTasks.length}</p>
                </div>
            </section>

            {/* Task Sections */}
            <div className="space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                            Active Focus
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                                {activeTasks.length}
                            </span>
                        </h2>
                    </div>

                    {activeTasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {activeTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    showAssignee={false}
                                    onClick={() => setSelectedTask(task)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <div className="text-3xl mb-3">✨</div>
                            <p className="text-zinc-500 font-medium">All caught up! The workspace is clear.</p>
                        </div>
                    )}
                </section>

                {doneTasks.length > 0 && (
                    <section>
                        <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-6 border-b pb-2 border-zinc-100 dark:border-zinc-800">Recently Resolved</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                            {doneTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    showAssignee={false}
                                    onClick={() => setSelectedTask(task)}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
