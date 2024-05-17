import { ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';

interface TableProps extends ComponentPropsWithoutRef<'table'> {}

export function Table({ className, children }: TableProps) {
  return (
    <div
      className={classNames(
        'overflow-x-auto w-full relative animate-fadeIn h-full scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-2 scrollbar-w-2',
        className
      )}
    >
      <table className="w-full text-left">{children}</table>
    </div>
  );
}
