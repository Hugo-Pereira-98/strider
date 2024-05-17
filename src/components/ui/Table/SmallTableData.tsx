import { ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';

type SmallTableDataProps = ComponentPropsWithoutRef<'td'> & {
  verticalPaddingClass?: 'small' | 'large' | 'none';
  verticalBorders?: boolean;
};

export function SmallTableData({
  children,
  className,
  verticalPaddingClass = 'small',
  verticalBorders = false,
  ...props
}: SmallTableDataProps) {
  const classObj = {
    'border-r': verticalBorders,
    ...(className && { [className]: true }),
  };

  return (
    <td
      className={classNames(
        `px-4 py-2 body-small-regular whitespace-nowrap text-gray-light-950 dark:text-gray-dark-400 align-middle border-t border-gray-light-200 dark:border-gray-dark-800`,
        classObj
      )}
      {...props}
    >
      {children}
    </td>
  );
}
