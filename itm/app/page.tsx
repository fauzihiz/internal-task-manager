'use client';

import { useTasks } from '@/context/TaskContext';
import { UserRole } from '@/lib/types';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import MemberDashboard from '@/components/dashboard/MemberDashboard';

export default function Home() {
  const { currentUser } = useTasks();

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500 animate-pulse">Initializing application...</p>
      </div>
    );
  }

  return (
    <>
      {currentUser.role === UserRole.MANAGER ? (
        <ManagerDashboard />
      ) : (
        <MemberDashboard />
      )}
    </>
  );
}
