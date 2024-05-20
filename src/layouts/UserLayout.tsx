import { AlignLeft } from '@/components/Icons/AlignLeft';
import { PosterrLogo } from '@/components/Icons/PosterrLogo';
import { Sidebar } from '@/components/Sidebar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SelectDown } from '@/components/ui/SelectDown';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useSidebar } from '../contexts/SidebarContext';

interface UserLayoutProps {
  menuItems?: {
    url: string;
    text: string;
  }[];
  sessions: {
    text: string;
    icon?: any;
    route?: string;
  }[];
  children: ReactNode;
  useBorder?: boolean | undefined;
  useHeader?: boolean | undefined;
}

export function UserLayout({
  menuItems,
  sessions,
  children,
  useBorder = true,
  useHeader = true,
}: UserLayoutProps) {
  const router = useRouter();

  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <div className="2xl:grid 2xl:grid-cols-[auto,1fr]">
      <Sidebar />

      <div className="relative flex flex-1 flex-col 2xl:items-center">
        <div className="2xl:hidden border-b border-gray-light-200 dark:border-gray-dark-800 pb-4 flex items-center justify-between p-6 sm:p-8">
          <Link href="/indications">
            <PosterrLogo className="fill-gray-light-900 dark:fill-gray-dark-300" />
          </Link>

          <button type="button" onClick={() => setSidebarOpen(true)}>
            <AlignLeft className="stroke-gray-light-700 dark:stroke-gray-dark-300" />
          </button>
        </div>

        <div className="w-full 2xl:w-[calc(100vw-224px)] 2xl:max-w-[1280px]">
          {useHeader && (
            <div className="px-6 pt-6 sm:px-8 sm:pt-8 ">
              <Breadcrumbs
                type="textIcon"
                textPosition="rightIcon"
                sessions={sessions}
                separator="arrow"
              />

              {menuItems && (
                <>
                  <div
                    className={classNames(
                      'hidden h-8 sm:flex items-center gap-2',
                      {
                        'border-b border-gray-light-200 dark:border-gray-dark-800':
                          useBorder,
                      }
                    )}
                  >
                    {menuItems.map((menuItem) => (
                      <div key={menuItem.url} className="relative">
                        <Link
                          href={menuItem.url}
                          className={classNames(
                            'font-bold',
                            {
                              'text-primary-700 dark:text-gray-dark-300':
                                router.asPath === menuItem.url,
                              'text-gray-light-500 dark:text-gray-dark-400':
                                router.asPath !== menuItem.url,
                              'border-b-2 border-primary-700 dark:border-gray-dark-300':
                                router.asPath === menuItem.url && useBorder,
                              'bg-[#F9F5FF] dark:bg-gray-dark-800 rounded-sm':
                                router.asPath === menuItem.url && !useBorder,
                            },
                            'body-small-semibold',
                            { 'block h-8 border-spacing-1 px-1': useBorder },
                            { 'flex items-center px-3 h-10': !useBorder }
                          )}
                        >
                          {menuItem.text}
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="sm:hidden">
                    <SelectDown menuItems={menuItems} />
                  </div>
                </>
              )}
            </div>
          )}
          <main className={classNames('5xl:max-w-[75rem] 5xl:mx-auto')}>
            <div className="animate-fadeIn">{children}</div>
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
