export function SmallTableHead({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  verticalPaddingClass?: 'small' | 'large' | 'none';
}) {
  const clickableClass = onClick ? 'cursor-pointer hover:underline' : '';

  return (
    <th
      className={`body-extra-small-medium py-2 whitespace-nowrap text-gray-light-600 dark:text-gray-dark-400 !${className} ${clickableClass}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}
