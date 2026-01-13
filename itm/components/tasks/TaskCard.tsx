'use client';

import { Task, TaskStatus, TaskPriority } from '@/lib/types';
import { useTasks } from '@/context/TaskContext';

interface TaskCardProps {
    task: Task;
    showAssignee?: boolean;
    onClick?: () => void;
}

export default function TaskCard({ task, showAssignee = true, onClick }: TaskCardProps) {
    const { users, updateTaskStatus } = useTasks();
    const assignee = users.find((u) => u.id === task.assigneeId);

    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;

    const statusColors = {
        [TaskStatus.TODO]: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
        [TaskStatus.ONGOING]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        [TaskStatus.DONE]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };

    const priorityColors = {
        [TaskPriority.HIGH]: 'text-red-500',
        [TaskPriority.MEDIUM]: 'text-amber-500',
        [TaskPriority.LOW]: 'text-zinc-400',
    };

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col rounded-xl border p-5 transition-all hover:shadow-lg dark:bg-zinc-900 cursor-pointer ${isOverdue ? 'border-red-200 bg-red-50/30 dark:border-red-900/30' : 'border-zinc-200 bg-white dark:border-zinc-800'
                }`}>
            <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[task.status]}`}>
                    {task.status}
                </span>
                <div className="flex items-center gap-2">
                    {isOverdue && (
                        <span className="flex h-5 items-center gap-1 rounded-md bg-red-100 px-2 text-[10px] font-bold text-red-600 dark:bg-red-900/40 dark:text-red-400">
                            ⚠️ OVERDUE
                        </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>
            </div>

            <h3 className="mb-1 text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {task.title}
            </h3>

            <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {task.description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t pt-4 border-zinc-100 dark:border-zinc-800">
                {showAssignee && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                            {assignee?.avatar || assignee?.name.charAt(0)}
                        </div>
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                            {assignee?.name || 'Unassigned'}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    {task.comments.length > 0 && (
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                            💬 {task.comments.length}
                        </span>
                    )}
                    <span className="text-[10px] text-zinc-400">
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Quick Status Toggle for Demo */}
            <div className="absolute right-4 top-12 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                {task.status !== TaskStatus.DONE && (
                    <button
                        onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, TaskStatus.DONE); }}
                        className="rounded bg-white dark:bg-zinc-800 px-2 py-1 text-[10px] font-bold shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-green-50 hover:text-green-600"
                    >
                        ✓ Done
                    </button>
                )}
            </div>
        </div>
    );
}
