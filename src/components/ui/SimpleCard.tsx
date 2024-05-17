import { ReactNode } from 'react';

interface SimpleCardProps {
  className?: string;
  children: ReactNode;
}

export const SimpleCard = ({ className, children }: SimpleCardProps) => {
  return (
    <div
      className={`
        w-full bg-gray-light-50 dark:bg-gray-dark-900 
        rounded-xl shadow-extra-small p-12
        ${className}
      `}
    >
      {children}
    </div>
  );
};
