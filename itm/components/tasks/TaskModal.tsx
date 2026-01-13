'use client';

import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Task, TaskStatus, TaskPriority, UserRole } from '@/lib/types';

interface TaskModalProps {
    task: Task;
    onClose: () => void;
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
    const { updateTaskStatus, addComment, currentUser, deleteTask, editTask, users } = useTasks();
    const [commentText, setCommentText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description || '');
    const [editAssignee, setEditAssignee] = useState(task.assigneeId || '');
    const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
    const [editDueDate, setEditDueDate] = useState(task.dueDate.split('T')[0]);

    const isManager = currentUser?.role === UserRole.MANAGER;
    const members = users.filter(u => u.role === UserRole.MEMBER);

    const handleStatusChange = (status: TaskStatus) => {
        // Business Rule: Strict Workflow Enforcement
        // Todo -> Ongoing -> Done
        const canMove =
            (task.status === TaskStatus.TODO && status === TaskStatus.ONGOING) ||
            (task.status === TaskStatus.ONGOING && (status === TaskStatus.DONE || status === TaskStatus.TODO)) ||
            (task.status === TaskStatus.DONE && status === TaskStatus.TODO); // Reopen

        if (!canMove && !isManager) {
            alert(`Invalid workflow transition from ${task.status} to ${status}`);
            return;
        }

        updateTaskStatus(task.id, status);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            addComment(task.id, commentText);
            setCommentText('');
        }
    };

    const handleSaveEdit = () => {
        editTask(task.id, {
            title: editTitle,
            description: editDesc,
            assigneeId: editAssignee || undefined,
            priority: editPriority,
            dueDate: new Date(editDueDate).toISOString(),
        });
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
                    <div className="flex-1 mr-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${task.status === TaskStatus.DONE ? 'bg-green-100 text-green-700' :
                                    task.status === TaskStatus.ONGOING ? 'bg-blue-100 text-blue-700' : 'bg-zinc-200 text-zinc-700'
                                }`}>
                                {task.status}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${task.priority === TaskPriority.HIGH ? 'text-red-500' : 'text-zinc-400'
                                }`}>
                                {task.priority} Priority
                            </span>
                        </div>

                        {isEditing ? (
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-2xl font-bold bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold">{task.title}</h2>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Description</h3>
                            {isManager && !isEditing && (
                                <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 font-bold hover:underline">Edit Task</button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <textarea
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows={4}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Assignee</label>
                                        <select
                                            value={editAssignee}
                                            onChange={(e) => setEditAssignee(e.target.value)}
                                            className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2"
                                        >
                                            <option value="">Unassigned</option>
                                            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            value={editDueDate}
                                            onChange={(e) => setEditDueDate(e.target.value)}
                                            className="w-full text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSaveEdit} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-sm">Save Changes</button>
                                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-zinc-100 dark:bg-zinc-800 font-bold py-2 rounded-lg text-sm">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
                                {task.description || 'No description provided.'}
                            </p>
                        )}
                    </section>

                    <section>
                        <h3 className="text-xs font-bold uppercase text-zinc-400 mb-4 tracking-widest">Activity & Comments</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {task.comments.length > 0 ? (
                                task.comments.map((comment) => (
                                    <div key={comment.id} className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{comment.userName}</span>
                                            <span className="text-[10px] text-zinc-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm dark:text-zinc-200">{comment.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-400 italic">No activity yet.</p>
                            )}
                        </div>

                        <form onSubmit={handleAddComment} className="mt-6 flex gap-2">
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a progress update..."
                                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                            >
                                Post
                            </button>
                        </form>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusChange(TaskStatus.TODO)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${task.status === TaskStatus.TODO ? 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-50'
                                }`}
                        >
                            Todo
                        </button>
                        <button
                            onClick={() => handleStatusChange(TaskStatus.ONGOING)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${task.status === TaskStatus.ONGOING ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-50'
                                }`}
                        >
                            Ongoing
                        </button>
                        <button
                            onClick={() => handleStatusChange(TaskStatus.DONE)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${task.status === TaskStatus.DONE ? 'bg-green-600 text-white border-green-700' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-50'
                                }`}
                        >
                            Done
                        </button>
                    </div>

                    {isManager && (
                        <button
                            onClick={() => {
                                if (confirm('Delete this task forever?')) {
                                    deleteTask(task.id);
                                    onClose();
                                }
                            }}
                            className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                        >
                            🗑 Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
