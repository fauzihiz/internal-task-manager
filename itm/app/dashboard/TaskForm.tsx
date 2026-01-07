"use client"

import { useState } from "react"

export default function TaskForm({ onAddTask }: { onAddTask: (title: string) => void }) {
    const [title, setTitle] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!title) return

        onAddTask(title)
        setTitle("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task title"
            />
            <button type="submit">Add</button>
        </form>
    )
}

/*"use client"

import { useState } from "react"

export default function TaskForm() {
    const [title, setTitle] = useState("")

    return (
        <form>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task title"
            />
            <button type="submit">Add</button>
        </form>
    )
}*/