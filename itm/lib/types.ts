export enum UserRole {
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER',
}

export enum TaskStatus {
    TODO = 'TODO',
    ONGOING = 'ONGOING',
    DONE = 'DONE',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string; // ISO string format
    managerId: string;
    assigneeId?: string;
    createdAt: string;
    updatedAt: string;
    comments: Comment[];
}
