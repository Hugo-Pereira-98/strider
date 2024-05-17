import { AlignLeft } from '@/components/Icons/AlignLeft';
import { GondolaLogo } from '@/components/Icons/GondolaLogo';
import { Sidebar } from '@/components/Sidebar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SelectDown } from '@/components/ui/SelectDown';
import Image from 'next/image';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { IoBusinessOutline } from 'react-icons/io5';
import { IOrganizationBrandingDTO } from '../dtos';
import { ChevronDown } from '../components/Icons/ChevronDown';
import { useTheme } from 'next-themes';
import { useSidebar } from '../contexts/SidebarContext';

interface CompanyLayoutProps {
  organizationBranding?: IOrganizationBrandingDTO;
  title?: string;
  subtitle?: string;
  content?: ReactNode;
  menuItems?: MenuItem[];
  actionControls?: ReactNode;
  activeSection?: string;
  sessions: {
    text: string;
    icon?: any;
    route?: string;
  }[];
  children: ReactNode;
  useBorder?: boolean | undefined;
  useHeader?: boolean | undefined;
  onSectionChange?: (section: string) => void;
}

interface MenuItem {
  url?: string;
  text: string;
  section?: string;
}

export function CompanyLayout({
  organizationBranding,
  title,
  subtitle,
  content,
  menuItems,
  activeSection: initialActiveSection,
  actionControls,
  sessions,
  children,
  useBorder = true,
  useHeader = true,
  onSectionChange,
}: CompanyLayoutProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | undefined>(
    initialActiveSection
  );
  const [selectedItem, setSelectedItem] = useState<string | undefined>();
  const { sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed } =
    useSidebar();

  const handleMenuItemClick = (menuItem: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();

    if (menuItem.url) {
      router.push(menuItem.url);
    } else if (menuItem.section) {
      onSectionChange && onSectionChange(menuItem.section);
      setActiveSection(menuItem.section);
    }
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (menuItem: MenuItem) => {
    if (menuItem.url) {
      router.push(menuItem.url);
    } else if (menuItem.section) {
      onSectionChange && onSectionChange(menuItem.section);
      setSelectedItem(menuItem.text);
    }
    setDropdownVisible(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="2xl:grid 2xl:grid-cols-[auto,1fr]">
      <Sidebar />

      <div className="relative flex flex-1 flex-col 2xl:items-center">
        <div className="2xl:hidden border-b border-gray-light-200 dark:border-gray-dark-800 pb-4 flex items-center justify-between p-6 sm:p-8">
          <Link href="/indications">
            <GondolaLogo className="fill-gray-light-900 dark:fill-gray-dark-300" />
          </Link>

          <button type="button" onClick={() => setSidebarOpen(true)}>
            <AlignLeft className="stroke-gray-light-700 dark:stroke-gray-dark-300" />
          </button>
        </div>

        <div className="w-full 2xl:w-[calc(100vw-224px)] 2xl:max-w-[1280px]">
          {useHeader && (
            <div className="p-6 sm:p-8 space-y-6 pb-0">
              <Breadcrumbs
                type="textIcon"
                textPosition="rightIcon"
                sessions={sessions}
                separator="arrow"
              />
              <header className="w-full flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-3">{content}</div>
                <div className="flex items-center gap-3">{actionControls}</div>
              </header>

              {menuItems && (
                <>
                  <div
                    className={classNames(
                      'hidden h-8 sm:flex items-center gap-2'
                    )}
                  >
                    {menuItems.map((menuItem) => (
                      <div key={menuItem.text} className="relative">
                        <button
                          onClick={(e) => handleMenuItemClick(menuItem, e)}
                          className={classNames(
                            'hidden h-8 sm:flex items-center',
                            {
                              'text-primary-700 dark:text-gray-dark-300 bg-primary-50 dark:bg-gray-900 px-3 py-2 rounded-sm':
                                menuItem.section
                                  ? activeSection === menuItem.section
                                  : router.asPath === menuItem.url,
                              'text-gray-light-500 dark:text-gray-dark-400 px-3 py-2 rounded-sm':
                                menuItem.section
                                  ? activeSection !== menuItem.section
                                  : router.asPath !== menuItem.url,
                            },
                            'body-medium-semibold'
                          )}
                        >
                          {menuItem.text}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="sm:hidden">
                    <div className="relative flex flex-col items-center w-full max-w-[400px] rounded-md">
                      <button
                        onClick={() => setDropdownVisible((prev) => !prev)}
                        className="shadow-medium focus:shadow-focus-primary rounded-md p-2 px-4 outline-none max-w-[400px] w-full h-[46px] flex items-center justify-between"
                      >
                        {selectedItem || menuItems[0].text}

                        <ChevronDown />
                      </button>

                      {dropdownVisible && (
                        <div
                          ref={dropdownRef}
                          className="shadow-medium rounded-md top-14 overflow-auto max-h-60 absolute z-[60] w-full bg-white dark:bg-gray-dark-950"
                        >
                          {menuItems.map((menuItem) => (
                            <ul key={menuItem.text}>
                              <li
                                className="hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 py-2 px-4 cursor-pointer"
                                onClick={(e) => handleSelect(menuItem)}
                              >
                                {menuItem.text}
                              </li>
                            </ul>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <main
            className={classNames(
              {
                'p-6 sm:p-8': !(
                  router.pathname.includes('companies') ||
                  router.pathname.includes('indications')
                ),
              },
              {
                'lg:p-8':
                  router.pathname.includes('companies') ||
                  router.pathname.includes('indications'),
              },
              'w-full 2xl:w-[calc(100vw-224px)] 2xl:max-w-[1280px] !pt-0'
            )}
          >
            <div className="animate-fadeIn mt-2 space-y-6">{children}</div>
          </main>
        </div>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
