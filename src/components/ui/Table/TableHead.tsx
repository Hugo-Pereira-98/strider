export function TableHead({
  children,
  className,
  onClick,
  verticalPaddingClass = 'small',
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  verticalPaddingClass?: 'small' | 'large' | 'none';
}) {
  const clickableClass = onClick ? 'cursor-pointer hover:underline' : '';
  let paddingClass = '';

  switch (verticalPaddingClass) {
    case 'small':
      paddingClass = 'py-3';
      break;
    case 'large':
      paddingClass = 'py-4';
      break;
    case 'none':
    default:
      paddingClass = 'py-0';
  }

  return (
    <th
      className={`pl-6 ${paddingClass} pr-4 body-extra-small-medium whitespace-nowrap text-gray-light-600 dark:text-gray-dark-400 !${className} ${clickableClass}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
}
