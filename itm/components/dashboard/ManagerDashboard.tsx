'use client';

import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { UserRole, TaskStatus, TaskPriority, Task } from '@/lib/types';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import TaskModal from '@/components/tasks/TaskModal';

export default function ManagerDashboard() {
    const { sortedTasks, users, isUserOverloaded, getUserBurden } = useTasks();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Search & Filter state
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

    const teamMembers = users.filter(u => u.role === UserRole.MEMBER);

    const filteredTasks = sortedTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    return (
        <div className="p-8 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Team Overview</h1>
                    <p className="text-zinc-500 font-medium">Monitoring workload, burden metrics, and task urgency.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                    <span>+</span> Create New Task
                </button>
            </header>

            {showCreateModal && <CreateTaskForm onClose={() => setShowCreateModal(false)} />}
            {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}

            {/* Team Workload Stats */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => {
                    const memberTasks = sortedTasks.filter(t => t.assigneeId === member.id);
                    const activeTasks = memberTasks.filter(t => t.status !== TaskStatus.DONE).length;
                    const overloaded = isUserOverloaded(member.id);
                    const burdenScore = getUserBurden(member.id);

                    return (
                        <div key={member.id} className={`bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm transition-all ${overloaded ? 'border-red-200 dark:border-red-900/40 ring-1 ring-red-100 dark:ring-red-900/20' : 'border-zinc-200 dark:border-zinc-800'
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                                        {member.avatar || member.name.charAt(0)}
                                    </div>
                                    {overloaded && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white dark:border-zinc-900 shadow-sm"></span>
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm flex items-center gap-2">
                                        {member.name}
                                        {overloaded && <span className="text-[10px] text-red-500 font-bold uppercase">Overloaded</span>}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{memberTasks.length} TASKS</p>
                                        <span className="text-zinc-300">|</span>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${overloaded ? 'text-red-500' : 'text-zinc-500'}`}>
                                            BURDEN: {burdenScore}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4 border-zinc-50 dark:border-zinc-800">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Active</p>
                                    <p className="text-xl font-bold">{activeTasks}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Success Rate</p>
                                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {memberTasks.length > 0 ? Math.round((memberTasks.filter(t => t.status === TaskStatus.DONE).length / memberTasks.length) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <div className="relative w-full md:w-96">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by task title..."
                    />
                    <span className="absolute left-3.5 top-2.5 text-zinc-400 text-xs">🔍</span>
                </div>
                <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setPriorityFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${priorityFilter === 'ALL' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'}`}
                    >
                        All Priority
                    </button>
                    <button
                        onClick={() => setPriorityFilter(TaskPriority.HIGH)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${priorityFilter === TaskPriority.HIGH ? 'bg-red-500 text-white border-red-600' : 'bg-white dark:bg-zinc-800 text-red-500 border-red-200 dark:border-red-900/30'}`}
                    >
                        High Only
                    </button>
                    <button
                        onClick={() => setPriorityFilter(TaskPriority.MEDIUM)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${priorityFilter === TaskPriority.MEDIUM ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-zinc-800 text-amber-500 border-amber-200 dark:border-amber-900/30'}`}
                    >
                        Medium
                    </button>
                </div>
            </div>

            {/* Global Task List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Global Queue <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">{filteredTasks.length}</span>
                    </h2>
                </div>

                {filteredTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={() => setSelectedTask(task)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-zinc-400 font-medium italic border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                        No matching tasks found.
                    </div>
                )}
            </section>
        </div>
    );
}
