import { AlignLeft } from '@/components/Icons/AlignLeft';
import { GondolaLogo } from '@/components/Icons/GondolaLogo';
import { Sidebar } from '@/components/Sidebar';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useSidebar } from '../contexts/SidebarContext';

interface DefaultLayoutProps {
  title?: string;
  children: ReactNode;
}

export function DefaultLayout({ title, children }: DefaultLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <div className="2xl:grid 2xl:grid-cols-[auto,1fr]">
      <Sidebar />

      <div className="relative flex flex-1 flex-col 2xl:items-center w-full 2xl:w-[calc(100vw-224px)] 2xl:max-w-[1280px]">
        <div className="2xl:hidden border-b border-gray-light-200 dark:border-gray-dark-800 pb-4 flex items-center justify-between p-6 sm:p-8">
          <Link href="/indications">
            <GondolaLogo className="fill-gray-light-900 dark:fill-gray-dark-300" />
          </Link>

          <button type="button" onClick={() => setSidebarOpen(true)}>
            <AlignLeft className="stroke-gray-light-700 dark:stroke-gray-dark-300" />
          </button>
        </div>

        {title && (
          <header className="hidden xl:block w-full border-b border-b-gray-light-200 dark:border-b-gray-dark-800 mb-6 h-[61px]">
            <h1 className="text-xl font-semibold m-4 ml-8">{title}</h1>
          </header>
        )}

        <main className="5xl:max-w-[75rem] 5xl:mx-auto !pt-0 w-full h-full bg-transparent px-6 sm:px-8 lg:p-8 overflow-hidden">
          <div className={`w-full space-y-6 h-full`}>{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
