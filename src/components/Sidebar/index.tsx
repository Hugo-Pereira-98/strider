import { useSidebar } from '@/contexts/SidebarContext';
import { useSession } from '@/hooks/useSession';
import classNames from 'classnames';
import { FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from '../Icons/ChevronRight';
import { Signal } from '../Icons/Signal';
import { SearchBarModal } from '../Modal/SearchBarModal';
import SettingsCard from '../SettingsCard';
import { SidebarLink } from './SidebarLink';

export function Sidebar() {
  const sidebar = useRef<any>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const buttonVisibilityTimeout = useRef<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const { sidebarOpen, isCollapsed, setIsCollapsed } = useSidebar();

  const { session, updateSessionInfo } = useSession();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth <= 768;
      const isLargeScreen = screenWidth > 1536;

      setIsMobileView(isMobile);

      if (isMobile) {
        setIsCollapsed(true);
        setIsButtonVisible(false);
      } else {
        setIsButtonVisible(isLargeScreen && isCollapsed);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const sidebarEl = sidebar.current;
    const showButton = () => {
      if (!isMobileView) {
        setIsButtonVisible(true);
        if (buttonVisibilityTimeout.current !== null) {
          clearTimeout(buttonVisibilityTimeout.current);
          buttonVisibilityTimeout.current = null;
        }
      }
    };

    const hideButton = () => {
      if (!isMobileView) {
        buttonVisibilityTimeout.current = window.setTimeout(() => {
          setIsButtonVisible(false);
        }, 2000);
      }
    };

    if (sidebarEl && !isMobileView) {
      sidebarEl.addEventListener('mouseenter', showButton);
      sidebarEl.addEventListener('mouseleave', hideButton);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sidebarEl) {
        sidebarEl.removeEventListener('mouseenter', showButton);
        sidebarEl.removeEventListener('mouseleave', hideButton);
      }
      if (buttonVisibilityTimeout.current !== null) {
        clearTimeout(buttonVisibilityTimeout.current);
      }
    };
  }, [isMobileView, setIsCollapsed, isCollapsed]);

  useEffect(() => {
    const handleKeyPress = (e: any) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [setSearchModalOpen]);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    updateSessionInfo(session.themePreference, newCollapsedState);
  };

  return (
    <>
      <aside
        ref={sidebar}
        className={classNames(
          isCollapsed
            ? 'min-w-[224px] max-w-[224px]'
            : 'min-w-[64px] max-w-[64px]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'h-screen fixed 2xl:sticky left-0 top-0 bottom-0 z-[99] flex flex-col duration-150 2xl:translate-x-0 space-y-6 border-r border-gray-light-200 bg-white dark:bg-gray-dark-950 dark:border-gray-dark-800 '
        )}
      >
        <div
          className={`flex items-center border-b ${
            isCollapsed ? 'justify-start' : 'justify-center'
          } border-gray-light-200 dark:border-gray-dark-800 px-2 py-3 w-full h-[66px]`}
        >
          <Link href="/indications">
            {isCollapsed ? (
              <div className="flex items-center">
                <FaTwitter
                  size={32}
                  className="fill-primary-500 dark:fill-primary-600"
                />
                <span className="ml-2 text-gray-light-900 dark:text-white body-extra-large-medium">
                  Posterr
                </span>
              </div>
            ) : (
              <FaTwitter
                size={32}
                className="fill-primary-500 dark:fill-primary-600"
              />
            )}
          </Link>
        </div>

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear h-full w-full px-3">
          <nav className="flex flex-col h-full">
            <div className="flex-1">
              <ul className="space-y-2">
                <li>
                  <SidebarLink
                    openSidebar={isCollapsed}
                    href="/feed"
                    icon={Signal}
                    title="Feed"
                  />
                </li>
              </ul>
            </div>

            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full ${
                isCollapsed ? 'px-4' : 'px-2'
              }`}
            >
              <SettingsCard session={session} isCollapsed={isCollapsed} />
            </div>
          </nav>
        </div>

        <div className="h-8 w-8 absolute right-[-4px] top-1/3 z-10"></div>
        {isButtonVisible && (
          <div
            onClick={toggleSidebar}
            className={`fixed z-[9999] top-1/2 ${
              isCollapsed ? 'right-1' : 'right-[-36px]'
            } w-16 h-10 flex justify-end items-center transition-all duration-300 ease-in-out`}
          >
            <button
              className="-translate-y-1/2 w-6 h-6 rounded-full border shadow flex items-center justify-center cursor-pointer mr-2 border-gray-light-200 dark:border-gray-dark-800 bg-white dark:bg-gray-dark-950"
              style={{
                transform: `rotate(${isCollapsed ? 180 : 0}deg)`,
                transition: 'transform 0.3s ease',
                borderWidth: '0.96px',
              }}
            >
              <ChevronRight className="w-4 h-4 stroke-gray-light-500 dark:stroke-gray-dark-300" />
            </button>
          </div>
        )}
      </aside>

      {searchModalOpen && (
        <SearchBarModal
          open={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      )}
    </>
  );
}
