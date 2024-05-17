export function StickyTableHead({
  children,
  className,
  onClick,
  stickyPosition = 'left',
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  stickyPosition?: 'left' | 'right';
}) {
  const clickableClass = onClick ? 'cursor-pointer hover:underline' : '';

  const innerBorderStyle =
    stickyPosition === 'left'
      ? 'shadow-[inset_-1px_0_0_0_#eaecf0] dark:shadow-[inset_-1px_0_0_0_#1f242f]'
      : 'shadow-[inset_1px_0_0_0_#eaecf0] dark:shadow-[inset_1px_0_0_0_#1f242f]';

  const stickyClass = `sticky ${
    stickyPosition === 'left' ? 'left-0' : 'right-0'
  } z-50`;

  return (
    <th
      className={`pl-6 py-3 pr-4 body-extra-small-medium text-gray-light-600 dark:text-gray-dark-400 ${className} ${clickableClass} ${stickyClass} ${innerBorderStyle} bg-white dark:bg-gray-dark-950`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}
