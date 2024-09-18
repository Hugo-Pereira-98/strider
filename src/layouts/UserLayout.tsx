import { Sidebar } from '@/components/Sidebar';
import { ReactNode } from 'react';
import { useSidebar } from '../contexts/SidebarContext';
import Link from 'next/link';
import { AlignLeft } from '../components/Icons/AlignLeft';

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <div className="2xl:grid 2xl:grid-cols-[auto,1fr]">
      <Sidebar />

      <div className="relative flex flex-1 flex-col 2xl:items-center">
        <div className="h-16 2xl:hidden border-b border-gray-light-200 dark:border-gray-dark-800 pb-4 flex items-center justify-between p-6 sm:p-8">
          <Link href="/indications" passHref>
            <div className="w-6 h-6 bg-purple-950 text-center">C</div>
          </Link>

          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <AlignLeft className="stroke-gray-light-700 dark:stroke-gray-dark-300" />
          </button>
        </div>

        <div className="w-full 2xl:w-[calc(100vw-224px)] 2xl:max-w-[1280px]">
          <main>
            <div>{children}</div>
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      )}
    </div>
  );
}
