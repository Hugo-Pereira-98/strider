import classNames from 'classnames';
import { ComponentPropsWithoutRef } from 'react';

export function StickyTableData({
  children,
  className,
  stickyPosition = '',
  ...props
}: ComponentPropsWithoutRef<'td'> & {
  stickyPosition?: '' | 'left' | 'right';
}) {
  let stickyClass = '';
  if (stickyPosition === 'left')
    stickyClass =
      'sticky left-0 z-50 shadow-[inset_-1px_0_0_0_#eaecf0] dark:shadow-[inset_-1px_0_0_0_#1f242f]';
  if (stickyPosition === 'right')
    stickyClass =
      'sticky right-0 z-50 shadow-[inset_1px_0_0_0_#eaecf0] dark:shadow-[inset_1px_0_0_0_#1f242f]';

  return (
    <td
      className={classNames(
        'pl-6 py-3 pr-4 text-body-small font-regular text-gray-light-950 dark:text-gray-dark-50 align-middle border-t border-gray-light-200 dark:border-gray-dark-800 bg-white dark:bg-gray-dark-950',
        className,
        stickyClass
      )}
      {...props}
    >
      {children}
    </td>
  );
}
