'use client';

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden h-16 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-30">
                <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">TaskFlow</h2>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900 rounded-lg"
                >
                    ☰
                </button>
            </header>

            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 lg:ml-64 min-h-screen">
                {children}
            </main>
        </>
    );
}
