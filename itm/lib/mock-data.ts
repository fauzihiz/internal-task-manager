import { User, UserRole, Task, TaskStatus, TaskPriority } from './types';

export const mockUsers: User[] = [
    {
        id: 'u1',
        name: 'Alice Manager',
        email: 'alice@example.com',
        role: UserRole.MANAGER,
        avatar: 'A',
    },
    {
        id: 'u2',
        name: 'Bob Member',
        email: 'bob@example.com',
        role: UserRole.MEMBER,
        avatar: 'B',
    },
    {
        id: 'u3',
        name: 'Charlie Member',
        email: 'charlie@example.com',
        role: UserRole.MEMBER,
        avatar: 'C',
    },
];

const now = new Date();
const oneDay = 86400000;

export const mockTasks: Task[] = [
    {
        id: 't1',
        title: 'Design UI Mockups',
        description: 'Create initial design for the task manager dashboard including sidebar and task cards.',
        status: TaskStatus.ONGOING,
        priority: TaskPriority.HIGH,
        dueDate: new Date(now.getTime() - oneDay * 2).toISOString(), // Overdue
        managerId: 'u1',
        assigneeId: 'u2',
        createdAt: new Date(now.getTime() - oneDay * 5).toISOString(),
        updatedAt: new Date(now.getTime() - oneDay).toISOString(),
        comments: [
            {
                id: 'c1',
                userId: 'u2',
                userName: 'Bob Member',
                text: 'Working on the sidebar component now.',
                createdAt: new Date(now.getTime() - oneDay).toISOString(),
            }
        ],
    },
    {
        id: 't2',
        title: 'Setup Database Schema',
        description: 'Define and implement the Prisma schema for persistence.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(now.getTime() + oneDay * 3).toISOString(), // Future
        managerId: 'u1',
        assigneeId: 'u3',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        comments: [],
    },
    {
        id: 't3',
        title: 'Code Review: Auth Flow',
        description: 'Review the authentication middleware and session handling.',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date(now.getTime() - oneDay).toISOString(), // Overdue
        managerId: 'u1',
        assigneeId: 'u2',
        createdAt: new Date(now.getTime() - oneDay * 3).toISOString(),
        updatedAt: new Date(now.getTime() - oneDay * 3).toISOString(),
        comments: [],
    },
    {
        id: 't4',
        title: 'Documentation Update',
        description: 'Update the README with new installation steps.',
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        dueDate: new Date(now.getTime() - oneDay * 1).toISOString(),
        managerId: 'u1',
        assigneeId: 'u3',
        createdAt: new Date(now.getTime() - oneDay * 2).toISOString(),
        updatedAt: now.toISOString(),
        comments: [
            {
                id: 'c2',
                userId: 'u3',
                userName: 'Charlie Member',
                text: 'All done and pushed to main.',
                createdAt: now.toISOString(),
            }
        ],
    },
];
