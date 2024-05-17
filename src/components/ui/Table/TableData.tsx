import { ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';

type TableDataProps = ComponentPropsWithoutRef<'td'> & {
  verticalPaddingClass?: 'small' | 'large' | 'none';
  verticalBorders?: boolean;
};

export function TableData({
  children,
  className,
  verticalPaddingClass = 'small',
  verticalBorders = false,
  ...props
}: TableDataProps) {
  let paddingClass = '';

  switch (verticalPaddingClass) {
    case 'small':
      paddingClass = 'py-3';
      break;
    case 'large':
      paddingClass = 'py-4';
      break;
    case 'none':
      paddingClass = 'py-0';
      break;
  }

  return (
    <td
      className={classNames(
        `px-4 body-small-regular whitespace-nowrap text-gray-light-950 dark:text-gray-dark-50 align-middle border-t border-gray-light-200 dark:border-gray-dark-800 ${
          verticalBorders && 'border-r'
        } ${paddingClass}`,
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
