'use client'
import { useState } from "react"
import TaskList from "./TaskList"
import TaskForm from "./TaskForm"

export default function DashboardPage() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Belajar Next.js", status: "todo" },
        { id: 2, title: "Bikin Task Manager", status: "in-progress" },
    ])

    function addTask(title: string) {
        setTasks(prevTasks => [
            ...prevTasks,
            {
                id: Date.now(),
                title,
                status: "todo",
            },
        ])
    }

    function updateTaskStatus(id: number) {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? { ...task, status: "done" }
                    : task
            )
        )
    }


    function deleteTask(id: number) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <TaskForm onAddTask={addTask} />
            <TaskList
                tasks={tasks}
                onDelete={deleteTask}
                onUpdateStatus={updateTaskStatus}
            />
        </div>
    )
}
