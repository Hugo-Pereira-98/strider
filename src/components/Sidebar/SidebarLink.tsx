import React, { ReactElement, useEffect, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Badge from '../ui/Badge';

interface SvgProps {
  [x: string]: any;
}

interface SidebarLinkProps {
  href: string;
  icon(props: SvgProps): ReactElement;
  title?: string;
  openSidebar?: boolean;
  badgeNumber?: number;
  className?: string;
}

export function SidebarLink({
  href,
  icon: Icon,
  title,
  openSidebar = true,
  badgeNumber,
  className,
}: SidebarLinkProps) {
  const [showTitle, setShowTitle] = useState(openSidebar);
  const pathname = usePathname();
  const isActive = pathname?.includes(href);
  const [isHovered, setIsHovered] = useState(false);

  const showBadge = badgeNumber !== undefined && badgeNumber > 0;

  useEffect(() => {
    if (openSidebar) {
      const timer = setTimeout(() => {
        setShowTitle(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowTitle(false);
    }
  }, [openSidebar]);

  return (
    <Link href={href} passHref>
      <div
        className={classNames(
          'group',
          className,
          'flex items-center rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-900 transition-all duration-150 ease-in-out',
          {
            'w-full px-3 py-2 justify-start': openSidebar,
            'justify-center w-10 h-10': !openSidebar,
          },
          isActive
            ? 'bg-gray-light-50 dark:bg-gray-dark-900 text-gray-light-800 dark:text-gray-dark-200'
            : 'text-gray-light-700 dark:text-gray-dark-300'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="flex items-center justify-center w-full">
          <Icon
            className={classNames(
              {
                'stroke-purple-500 dark:stroke-purple-300': isActive,
                'w-4.5 h-4.5': !openSidebar,
              },
              {
                'stroke-gray-light-700 dark:stroke-gray-dark-400': !isActive,
              },
              'group-hover:text-gray-dark-200 flex-shrink-0'
            )}
          />
          {showTitle && title && (
            <span className="flex-1 body-medium-semibold ml-3">{title}</span>
          )}
          {isHovered && !openSidebar && (
            <div className="flex items-center h-10 w-24 absolute right-[-44px]">
              <div
                className={classNames(
                  'group',
                  className,
                  'flex items-center rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-900 transition-all duration-150 ease-in-out h-10 px-2 border border-gray-light-200 dark:border-gray-dark-800 shadow-[0_0_0_4px_rgba(152,162,179,0.14)]',
                  {
                    'w-full px-3 py-2 justify-start': openSidebar,
                  },
                  isActive
                    ? 'bg-gray-light-50 dark:bg-gray-dark-900 text-gray-light-800 dark:text-gray-dark-200'
                    : 'text-gray-light-700 dark:text-gray-dark-300'
                )}
              >
                <Link href={href} passHref>
                  <span className="flex items-center justify-center w-full">
                    <Icon className="stroke-purple-500 dark:stroke-purple-300 w-4.5 h-4.5" />
                    {title && (
                      <span className="flex-1 body-small-medium ml-3">
                        {title}
                      </span>
                    )}
                  </span>
                </Link>
                {showBadge && (
                  <Badge
                    label={badgeNumber}
                    color="primary"
                    size="sm"
                    badgeType="outlined"
                    corners="pill"
                    width="w-6"
                    className="ml-3"
                  />
                )}
              </div>
            </div>
          )}
        </span>
      </div>
    </Link>
  );
}
