'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { User, Task, TaskStatus, TaskPriority, Comment } from '@/lib/types';
import { mockUsers, mockTasks } from '@/lib/mock-data';

interface TaskContextType {
    tasks: Task[];
    users: User[];
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
    editTask: (taskId: string, updates: Partial<Task>) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
    assignTask: (taskId: string, assigneeId: string) => void;
    addComment: (taskId: string, text: string) => void;
    deleteTask: (taskId: string) => void;
    addMember: (user: Omit<User, 'id'>) => void;
    sortedTasks: Task[];
    isUserOverloaded: (userId: string) => boolean;
    getUserBurden: (userId: string) => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);

    // Logic: Calculate Burden Score (Hidden metric for balancing workload)
    const calculateTaskBurden = (task: Task) => {
        if (task.status === TaskStatus.DONE) return 0;

        let score = 0;

        // 1. Priority Score
        if (task.priority === TaskPriority.HIGH) score += 15;
        else if (task.priority === TaskPriority.MEDIUM) score += 10;
        else score += 5;

        // 2. Urgency Score (Based on Due Date)
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        const msPerDay = 86400000;
        const daysRemaining = (dueDate.getTime() - now.getTime()) / msPerDay;

        if (daysRemaining < 0) score += 20; // Overdue
        else if (daysRemaining <= 1) score += 15; // Due today/tomorrow
        else if (daysRemaining <= 3) score += 10; // Near due
        else score += 5;

        return score;
    };

    // Logic: Calculate total burden for a user
    const getUserBurden = (userId: string) => {
        return tasks
            .filter((t) => t.assigneeId === userId && t.status !== TaskStatus.DONE)
            .reduce((total, task) => total + calculateTaskBurden(task), 0);
    };

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => calculateTaskBurden(b) - calculateTaskBurden(a));
    }, [tasks]);

    const isUserOverloaded = (userId: string) => {
        // We can now use Burden Score for better "Overload" detection
        // e.g., Burden > 60 is high workload
        return getUserBurden(userId) > 60;
    };

    const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: `t-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [],
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const editTask = (taskId: string, updates: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
            )
        );
    };

    const updateTaskStatus = (taskId: string, status: TaskStatus) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
            )
        );
    };

    const assignTask = (taskId: string, assigneeId: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, assigneeId, updatedAt: new Date().toISOString() } : t
            )
        );
    };

    const addComment = (taskId: string, text: string) => {
        if (!currentUser) return;

        const newComment: Comment = {
            id: `c-${Math.random().toString(36).substr(2, 9)}`,
            userId: currentUser.id,
            userName: currentUser.name,
            text,
            createdAt: new Date().toISOString(),
        };

        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId ? { ...t, comments: [...t.comments, newComment], updatedAt: new Date().toISOString() } : t
            )
        );
    };

    const deleteTask = (taskId: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
    };

    const addMember = (userData: Omit<User, 'id'>) => {
        const newUser: User = {
            ...userData,
            id: `u-${Math.random().toString(36).substr(2, 9)}`,
        };
        setUsers((prev) => [...prev, newUser]);
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                users,
                currentUser,
                setCurrentUser,
                addTask,
                editTask,
                updateTaskStatus,
                assignTask,
                addComment,
                deleteTask,
                addMember,
                sortedTasks,
                isUserOverloaded,
                getUserBurden,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
