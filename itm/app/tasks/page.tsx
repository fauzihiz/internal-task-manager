'use client';

import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { TaskStatus, TaskPriority, Task, UserRole } from '@/lib/types';
import TaskModal from '@/components/tasks/TaskModal';

export default function TasksPage() {
    const { tasks, users, currentUser } = useTasks();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const isManager = currentUser?.role === UserRole.MANAGER;

    const filteredTasks = tasks.filter((task) => {
        // 1. Role-based filtering: Members only see their own tasks
        if (!isManager && task.assigneeId !== currentUser?.id) {
            return false;
        }

        // 2. Search filtering
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description?.toLowerCase().includes(search.toLowerCase());

        // 3. Status filtering
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
            case TaskPriority.HIGH: return 'text-red-500';
            case TaskPriority.MEDIUM: return 'text-amber-500';
            case TaskPriority.LOW: return 'text-zinc-400';
        }
    };

    return (
        <div className="p-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isManager ? 'Global Tasks' : 'My Assigned Tasks'}
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        {isManager ? 'Full directory of all organizational units and tasks.' : 'Tasks currently assigned to you for execution.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                        />
                        <span className="absolute left-3 top-2.5 text-zinc-400">🔍</span>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value={TaskStatus.TODO}>Todo</option>
                        <option value={TaskStatus.ONGOING}>Ongoing</option>
                        <option value={TaskStatus.DONE}>Done</option>
                    </select>
                </div>
            </header>

            {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 font-bold uppercase text-[10px] tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Task</th>
                                {isManager && <th className="px-6 py-4">Assignee</th>}
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredTasks.map((task) => {
                                const assignee = users.find(u => u.id === task.assigneeId);
                                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;

                                return (
                                    <tr
                                        key={task.id}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{task.title}</p>
                                            <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{task.description}</p>
                                        </td>
                                        {isManager && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                        {assignee?.avatar || assignee?.name.charAt(0) || '?'}
                                                    </div>
                                                    <span className="font-medium">{assignee?.name || 'Unassigned'}</span>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <span className={`font-bold text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${task.status === TaskStatus.DONE ? 'bg-green-100 text-green-700' :
                                                    task.status === TaskStatus.ONGOING ? 'bg-blue-100 text-blue-700' : 'bg-zinc-200 text-zinc-700'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${isOverdue ? 'text-red-500' : ''}`}>
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                                {isOverdue && <span className="text-[9px] font-bold text-red-500 uppercase">Overdue</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 font-bold hover:underline">View</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredTasks.length === 0 && (
                    <div className="p-12 text-center text-zinc-500 font-medium italic">
                        No tasks found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
