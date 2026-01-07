export default function TaskList({
    tasks,
    onDelete,
    onUpdateStatus
}: {
    tasks: any[]
    onDelete: (id: number) => void
    onUpdateStatus: (id: number) => void
}) {
    return (
        <ul>
            {tasks.map(task => (
                <li key={task.id}>
                    {task.title} - {task.status}
                    <button onClick={() => onUpdateStatus(task.id)}>
                        Mark Done
                    </button>
                    <button onClick={() => onDelete(task.id)}>Delete</button>
                </li>
            ))}
        </ul>
    )
}

/*export default function TaskList({ tasks }: { tasks: any[] }) {
    return (
        <ul>
            {tasks.map(task => (
                <li key={task.id}>
                    {task.title} - {task.status}
                </li>
            ))}
        </ul>
    )
}*/