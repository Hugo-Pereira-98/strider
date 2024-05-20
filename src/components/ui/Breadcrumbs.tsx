import React, { cloneElement } from 'react';
import { HiChevronRight, HiEllipsisHorizontal } from 'react-icons/hi2';
import classNames from 'classnames';
import { ChevronRight } from '../Icons/ChevronRight';
import { useRouter } from 'next/navigation';

interface SessionData {
  text?: string;
  icon?: JSX.Element;
  route?: string;
  iconType?: 'dots' | 'chevron';
}

interface BreadcrumbsProps {
  type: 'onlyIcon' | 'textIcon' | 'onlyText';
  textPosition: 'rightIcon' | 'leftIcon';
  sessions: Array<SessionData>;
  separator: 'arrow' | 'slash';
}

export default function Breadcrumbs({
  sessions,
  separator = 'arrow',
}: BreadcrumbsProps) {
  const router = useRouter();
  const renderSessionContent = (session: SessionData, isLast: boolean) => {
    const DefaultIcon: any =
      session.iconType === 'dots'
        ? HiEllipsisHorizontal
        : !session.icon
        ? () => {}
        : HiChevronRight;

    const handleSessionClick = () => {
      if (session.route) {
        router.push(session.route);
      }
    };

    const sessionContent = (
      <>
        {session.icon || (
          <DefaultIcon className="h-4 w-4 text-gray-500 dark:text-gray-dark-600" />
        )}
        {session.text && (
          <p
            className={classNames(
              'body-small-medium',
              isLast
                ? 'text-gray-700 dark:text-white'
                : 'text-gray-light-600 dark:text-gray-dark-300',
              isLast && 'body-small-semibold'
            )}
          >
            {session.text}
          </p>
        )}
      </>
    );

    if (session.route) {
      return (
        <button
          onClick={handleSessionClick}
          className="flex items-center cursor-pointer"
        >
          {sessionContent}
        </button>
      );
    } else {
      return <div className="flex items-center">{sessionContent}</div>;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {sessions.map((session, index) => (
        <React.Fragment key={index}>
          <div
            className={classNames(
              {
                'bg-gray-light-50 dark:bg-gray-dark-800':
                  index === sessions.length - 1,
              },
              { 'gap-2': session.icon },
              { 'px-2 py-1 pt-[6px] rounded-md': !session.icon },
              'flex items-center'
            )}
          >
            {renderSessionContent(session, index === sessions.length - 1)}
          </div>
          {index < sessions.length - 1 && (
            <div className="flex justify-center items-center text-gray-500 text-sm">
              {separator === 'arrow' ? (
                <ChevronRight className="stroke-gray-light-300 dark:stroke-gray-dark-600" />
              ) : (
                '/'
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
