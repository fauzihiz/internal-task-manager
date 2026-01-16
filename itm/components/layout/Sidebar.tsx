'use client';

import { useTasks } from '@/context/TaskContext';
import { UserRole } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const { users, currentUser, setCurrentUser } = useTasks();
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/', icon: '📊' },
        { label: 'My Tasks', href: '/tasks', icon: '✅' },
        { label: 'Team', href: '/team', icon: '👥' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            <aside className={`fixed left-0 top-0 h-screen w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">TaskFlow</h2>
                        <p className="text-xs text-zinc-500 uppercase font-semibold mt-1">Internal Manager</p>
                    </div>
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                                if (window.innerWidth < 1024) onToggle();
                            }}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === item.href
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2 px-2">
                        Switch User (Mock)
                    </label>
                    <select
                        value={currentUser?.id}
                        onChange={(e) => {
                            const user = users.find((u) => u.id === e.target.value);
                            setCurrentUser(user || null);
                        }}
                        className="w-full bg-zinc-50 border border-zinc-200 text-sm rounded-lg p-2 dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>

                    <div className="mt-4 flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center font-bold text-xs shadow-inner">
                            {currentUser?.avatar || currentUser?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
                            <p className="text-xs text-zinc-500 truncate">{currentUser?.role}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
