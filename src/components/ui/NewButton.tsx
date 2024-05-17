import React, { ButtonHTMLAttributes, useState } from 'react';

interface NewButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string | number;
  loading?: boolean;
  disabled?: boolean;
  rightIcon?: React.ReactElement;
  leftIcon?: React.ReactElement;
}

export default function NewButton({
  label,
  loading,
  disabled,
  rightIcon,
  leftIcon,
  className,
  ...rest
}: NewButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const iconColor = disabled
    ? 'stroke-gray-light-300 dark:stroke-gray-dark-600'
    : isHovered
    ? 'stroke-gray-light-700 dark:stroke-gray-light-200'
    : 'stroke-gray-light-600 dark:stroke-gray-dark-400';

  const textColor = disabled
    ? 'text-gray-light-300 dark:text-gray-dark-600'
    : isHovered
    ? 'text-gray-light-700 dark:text-gray-light-200'
    : 'text-gray-light-600 dark:text-gray-dark-400';

  const hasSingleIcon =
    (leftIcon && !rightIcon && !label) || (!leftIcon && rightIcon && !label);
  const buttonClasses = `flex items-center justify-center gap-[6px] p-2 rounded-md hover:cursor-pointer ${
    disabled && 'hover:cursor-default'
  } ${hasSingleIcon ? 'justify-center' : ''} ${className}`;

  return (
    <button
      {...rest}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={buttonClasses}
      disabled={disabled || loading}
    >
      {leftIcon && (
        <div className={`icon-container`}>
          {React.cloneElement(leftIcon, {
            className: `${leftIcon.props.className || ''} ${iconColor}`,
          })}
        </div>
      )}
      {label && (
        <span className={`body-small-semibold ${textColor}`}>{label}</span>
      )}
      {rightIcon && (
        <div className={`icon-container`}>
          {React.cloneElement(rightIcon, {
            className: `${rightIcon.props.className || ''} ${iconColor}`,
          })}
        </div>
      )}
    </button>
  );
}
