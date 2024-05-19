import classNames from 'classnames';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useSession } from '../../hooks/useSession';
import { Activity } from '../Icons/Activity';
import { Building2 } from '../Icons/Building2';
import { Candlestick } from '../Icons/Candlestick';
import { ChevronRight } from '../Icons/ChevronRight';
import { Posterr } from '../Icons/Posterr';
import { PosterrLogo } from '../Icons/PosterrLogo';
import { LineChartUp } from '../Icons/LineChartUp';
import { SearchBarModal } from '../Modal/SearchBarModal';
import SettingsCard from '../SettingsCard';
import SearchButton from '../ui/SearchButton';
import { SidebarLink } from './SidebarLink';

export function Sidebar() {
  const sidebar = useRef<any>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { setTheme } = useTheme();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const buttonVisibilityTimeout = useRef<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const { sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed } =
    useSidebar();

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

    updateSessionInfo(
      session.institutionName,
      session.themePreference,
      newCollapsedState
    );
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
            isCollapsed ? 'justify-start' : 'justify-center pl-6'
          } border-gray-light-200 dark:border-gray-dark-800 px-4 py-2 pt-4 w-full h-[66px] `}
        >
          <Link href="/indications">
            {isCollapsed ? (
              <PosterrLogo className="fill-gray-light-900 dark:fill-white" />
            ) : (
              <Posterr className="fill-gray-light-900 dark:fill-white" />
            )}
          </Link>
        </div>

        <SearchButton
          isOpen={isCollapsed}
          setSearchModalOpen={setSearchModalOpen}
        />

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear h-full w-full px-3">
          <nav className="flex flex-col h-full">
            <div className="flex-1">
              <ul className="space-y-2">
                <li>
                  <SidebarLink
                    openSidebar={isCollapsed}
                    href="/markets"
                    icon={Candlestick}
                    title="Markets"
                  />
                </li>

                <li>
                  <SidebarLink
                    openSidebar={isCollapsed}
                    href="/companies"
                    icon={Building2}
                    title="Companies"
                  />
                </li>

                <li>
                  <SidebarLink
                    href="#"
                    icon={LineChartUp}
                    title="Portfolio"
                    openSidebar={isCollapsed}
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
