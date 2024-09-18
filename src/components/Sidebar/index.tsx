import { useSidebar } from '@/contexts/SidebarContext';
import classNames from 'classnames';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Signal } from '../Icons/Signal';
import { SidebarLink } from './SidebarLink';

export function Sidebar() {
  const sidebar = useRef<any>(null);

  const [isNotDesktopView, setIsNotDesktopView] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth <= 1280;
      setIsNotDesktopView(isMobile);

      if (isMobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setSidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={classNames(
        isNotDesktopView && !sidebarOpen
          ? '-translate-x-full'
          : 'translate-x-0',
        'w-[224px]',
        'h-screen fixed 2xl:sticky left-0 top-0 bottom-0 z-[99] flex flex-col duration-150 space-y-6 border-r border-gray-light-200 bg-white dark:bg-gray-dark-950 dark:border-gray-dark-800 '
      )}
    >
      <div className="flex items-center px-2 py-3 w-full">
        <Link href="/feed">
          <div className="w-6 h-6 bg-purple-950 text-center">C</div>
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear h-full w-full px-3">
        <nav className="flex flex-col h-full">
          <div className="flex-1">
            <ul className="space-y-2">
              <li>
                <SidebarLink
                  openSidebar={true}
                  href="/feed"
                  icon={Signal}
                  title="Feed"
                />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
