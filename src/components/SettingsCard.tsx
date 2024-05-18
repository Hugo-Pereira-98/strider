import { useSession } from '@/hooks/useSession';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { ChevronRight } from '../components/Icons/ChevronRight';
import { SignOut } from '../components/Icons/SignOut';
import { Check } from './Icons/Check';
import { DarkTheme } from './Icons/DarkTheme';
import { Individual } from './Icons/Individual';
import { LightTheme } from './Icons/LightTheme';
import { SettingsWorkspace } from './Icons/SettingsWorkspace';
import { SystemTheme } from './Icons/SystemTheme';
import { openDB, updateUserThemePreference } from '@/utils/indexedDB';

interface SettingsCardProps {
  isCollapsed: boolean;
  session: any;
}

type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';

interface ThemeIconProps {
  theme: ThemePreference | undefined;
}

const ThemeIcon: React.FC<ThemeIconProps> = ({ theme = 'SYSTEM' }) => {
  switch (theme) {
    case 'DARK':
      return (
        <DarkTheme
          className="stroke-gray-light-600 dark:stroke-gray-dark-400"
          width="24"
          height="24"
        />
      );
    case 'LIGHT':
      return (
        <LightTheme
          className="stroke-gray-light-600 dark:stroke-gray-dark-400"
          width="24"
          height="24"
        />
      );
    case 'SYSTEM':
    default:
      return (
        <SystemTheme
          className="stroke-gray-light-600 dark:stroke-gray-dark-400"
          width="24"
          height="24"
        />
      );
  }
};

const SettingsCard: React.FC<SettingsCardProps> = ({
  isCollapsed,
  session,
}) => {
  const router = useRouter();
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { updateSessionInfo, signOut } = useSession();

  const ref = useRef<HTMLDivElement>(null);

  const handleThemeChange = async (themePreference: ThemePreference) => {
    setTheme(themePreference.toLowerCase());
    updateSessionInfo(session.institutionName, themePreference);

    try {
      const db = await openDB();
      await updateUserThemePreference(db, session.email, themePreference);
      console.log('Theme preference updated successfully');
    } catch (error) {
      console.error('Failed to update theme preference:', error);
    }
  };

  const toggleOpen: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsThemeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
      : '';
  };

  const handleSignOut: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    signOut();
  };

  return (
    <div
      ref={ref}
      className={`h-[50px] cursor-pointer flex w-full items-center border border-transparent hover:border-gray-light-300 hover:dark:border-gray-dark-700 p-[6px] my-3 hover:bg-gray-light-50 hover:dark:bg-gray-dark-800 rounded-md ${
        isCollapsed ? 'justify-between' : 'justify-center'
      }`}
      style={{ position: 'relative', zIndex: 20 }}
      onClick={toggleOpen}
    >
      {isOpen && (
        <>
          <div
            className={`absolute transform -translate-y-full -translate-x-1/2 top-[-4px] ${
              isCollapsed ? 'right-[-115px]' : 'right-[-265px]'
            } max-w-[208px] w-[208px] min-w-[208px] rounded-md shadow-lg border border-gray-light-300 dark:border-gray-dark-700 bg-white dark:bg-gray-dark-950 z-50`}
            onClick={() => router.push('/settings/security')}
          >
            <div className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 rounded-t-md dark:hover:bg-gray-dark-800 flex items-center gap-1 cursor-pointer">
              <Individual
                className="stroke-gray-light-600 dark:stroke-gray-dark-400"
                width="24"
                height="24"
              />
              <span>Account Settings</span>
            </div>

            <div
              className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/settings/team')}
            >
              <SettingsWorkspace
                className="stroke-gray-light-600 dark:stroke-gray-dark-400"
                width="24"
                height="24"
              />
              <span>Workspace Settings</span>
            </div>
            <div
              className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border-t border-b dark:border-gray-dark-800 flex items-center justify-between cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsThemeOpen(!isThemeOpen);
              }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex">
                  <ThemeIcon theme={session?.themePreference || 'SYSTEM'} />
                  <span>Theme</span>
                </div>
                <div className="flex items-center gap-2 h-full">
                  <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 pb-1">
                    {(theme || '').charAt(0).toUpperCase() +
                      (theme || '').slice(1)}
                  </span>
                  <ChevronRight
                    width="24"
                    height="24"
                    className="stroke-gray-light-500 dark:stroke-gray-dark-400"
                  />
                </div>
              </div>
            </div>
            <div
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 rounded-b-md dark:hover:bg-gray-dark-800 flex items-center gap-1 cursor-pointer"
            >
              <div className="flex gap-1">
                <SignOut
                  className="stroke-gray-light-600 dark:stroke-gray-dark-400"
                  width="18"
                  height="18"
                />

                <span>Log Out</span>
              </div>
            </div>
          </div>
          {isThemeOpen && (
            <div
              className={`absolute transform -translate-y-full -translate-x-1/2 top-[-49px] ${
                isCollapsed ? 'right-[-324px]' : 'right-[-475px]'
              } max-w-[208px] w-[208px] min-w-[208px] rounded-md shadow-lg border border-gray-light-300 dark:border-gray-dark-700 bg-white dark:bg-gray-dark-950 z-50 `}
            >
              <div
                onClick={() => handleThemeChange('DARK')}
                className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 rounded-t-md dark:hover:bg-gray-dark-800 flex items-center gap-1 cursor-pointer"
              >
                <div className="flex w-full justify-between">
                  <div className="flex">
                    <DarkTheme
                      className="stroke-gray-light-600 dark:stroke-gray-dark-400"
                      width="24"
                      height="24"
                    />
                    <span>Dark</span>
                  </div>
                  {resolvedTheme === 'dark' && (
                    <Check className="w-4 h-4 stroke-primary-600 dark:stroke-primary-500" />
                  )}
                </div>
              </div>

              <div
                onClick={() => handleThemeChange('LIGHT')}
                className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 flex items-center gap-1 cursor-pointer"
              >
                <div className="flex w-full justify-between">
                  <div className="flex">
                    <LightTheme
                      className="stroke-gray-light-600 dark:stroke-gray-dark-400"
                      width="24"
                      height="24"
                    />
                    <span>Light</span>
                  </div>
                  {resolvedTheme === 'light' && (
                    <Check className="w-4 h-4 stroke-primary-600 dark:stroke-primary-500" />
                  )}
                </div>
              </div>
              <div
                onClick={() => handleThemeChange('SYSTEM')}
                className="w-full text-left px-4 py-3 body-small-medium text-gray-light-700 dark:text-gray-dark-300 hover:bg-gray-light-50 rounded-b-md dark:hover:bg-gray-dark-800 flex items-center gap-1 cursor-pointer"
              >
                <div className="flex w-full justify-between">
                  <SystemTheme
                    className="stroke-gray-light-600 dark:stroke-gray-dark-400"
                    width="24"
                    height="24"
                  />
                  <span>System Default</span>
                </div>
                {resolvedTheme === 'system' && (
                  <Check className="w-4 h-4 stroke-primary-600 dark:stroke-primary-500" />
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="rounded-full h-8 w-8 border border-gray-light-400 dark:border-gray-dark-800 flex items-center justify-center relative">
        <div className="bg-success-500 rounded-full h-[10px] w-[10px] absolute right-1 bottom-1 transform translate-y-1/2 translate-x-1/2" />
        <span className="body-small-semiBold text-gray-light-500 dark:text-gray-dark-400">
          {getInitials(session?.name)}
        </span>
      </div>

      {isCollapsed && (
        <div className="flex flex-col justify-center mr-5 w-20 flex-1 ml-2">
          <p className="truncate text-body-small font-semibold dark:text-gray-dark-300">
            {session?.name}
          </p>
          <p className="truncate text-body-small font-normal max-w-[220px] dark:text-gray-dark-400">
            {session?.institutionName}
          </p>
        </div>
      )}

      {isCollapsed && (
        <ChevronRight className="w-4 h-4 stroke-gray-light-500 dark:stroke-gray-dark-300" />
      )}
    </div>
  );
};

export default SettingsCard;
