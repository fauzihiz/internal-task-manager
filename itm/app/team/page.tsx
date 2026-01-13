'use client';

import { useTasks } from '@/context/TaskContext';
import { UserRole, TaskStatus } from '@/lib/types';

export default function TeamPage() {
    const { users, tasks, isUserOverloaded, getUserBurden, currentUser } = useTasks();
    const isManager = currentUser?.role === UserRole.MANAGER;

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Team Directory</h1>
                <p className="text-zinc-500 font-medium">Manage and monitor team performance and {isManager ? 'burden levels' : 'workloads'}.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => {
                    const userTasks = tasks.filter((t) => t.assigneeId === user.id);
                    const completedCount = userTasks.filter((t) => t.status === TaskStatus.DONE).length;
                    const activeCount = userTasks.length - completedCount;
                    const overloaded = isUserOverloaded(user.id);
                    const burdenScore = getUserBurden(user.id);
                    const completionRate = userTasks.length > 0
                        ? Math.round((completedCount / userTasks.length) * 100)
                        : 0;

                    return (
                        <div
                            key={user.id}
                            className={`bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${(isManager && overloaded) ? 'border-red-200 dark:border-red-900/40 bg-red-50/10' : 'border-zinc-200 dark:border-zinc-800'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg relative ${user.role === UserRole.MANAGER ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                                        }`}>
                                        {user.avatar || user.name.charAt(0)}
                                        {isManager && overloaded && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-zinc-900"></span>
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{user.name}</h3>
                                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{user.role}</p>
                                    </div>
                                </div>
                                {isManager && overloaded && (
                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                                        High Burden
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5 uppercase text-zinc-400">
                                        <span>Performance</span>
                                        <span>{completionRate}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${completionRate > 70 ? 'bg-green-500' : completionRate > 30 ? 'bg-blue-500' : 'bg-zinc-400'
                                                }`}
                                            style={{ width: `${completionRate}%` }}
                                        />
                                    </div>
                                </div>

                                <div className={`grid ${isManager ? 'grid-cols-2' : 'grid-cols-1'} gap-4 pt-2`}>
                                    {isManager && (
                                        <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Burden</p>
                                            <p className={`text-xl font-bold ${overloaded ? 'text-red-500' : ''}`}>{burdenScore}</p>
                                        </div>
                                    )}
                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Active Tasks</p>
                                        <p className="text-xl font-bold">{activeCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
