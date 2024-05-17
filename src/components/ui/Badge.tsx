import Image from 'next/image';
import React from 'react';

const BadgePadding = {
  sm: 'py-[2px] px-[8px]',
  md: 'py-[1px] px-[8px]',
  lg: 'py-[4px] px-[10px]',
};

const IconSize = {
  sm: 'h-[10px] w-[10px]',
  md: 'h-[12px] w-[12px]',
  lg: 'h-[14px] w-[14px]',
};

const GapSize = {
  sm: 'gap-[4px]',
  md: 'gap-[5px]',
  lg: 'gap-[6px]',
};

const BadgeFontSize = {
  sm: 'body-extra-small-medium',
  md: 'body-extra-small-medium',
  lg: 'body-medium-medium',
};

const CornerTypes = {
  smooth: 'rounded-md',
  sharp: 'rounded-none',
  pill: 'rounded-full',
};

const BadgeColor = {
  light: {
    primary: 'text-gray-900',
    secondary: '',
    tertiary: '',
    purple: 'text-primary-700',
    error: 'text-error-700',
    warning: 'text-warning-500',
    success: 'text-success-700',
  },
  dark: {
    primary: 'text-white',
    secondary: '',
    tertiary: '',
    purple: 'text-primary-800',
    error: 'text-white',
    warning: 'text-white',
    success: 'text-white',
  },
  outlined: {
    primary: 'text-primary-700 dark:text-primary-300',
    secondary: 'text-gray-light-700 dark:text-gray-dark-300',
    tertiary: 'text-gray-light-700 dark:text-gray-dark-300',
    purple: 'text-primary-800 dark:text-primary-300',
    error: 'text-error-700',
    warning: 'text-warning-500',
    success: 'text-success-700 dark:text-success-300',
  },
  theme: {
    primary: 'text-primary-700 dark:text-primary-300',
    secondary: 'text-gray-light-700 dark:text-gray-dark-300',
    tertiary: 'text-gray-light-700 dark:text-gray-dark-300',
    purple: 'text-primary-800 dark:text-primary-300',
    error: 'text-error-700',
    warning: 'text-warning-500',
    success: 'text-success-700 dark:text-success-300',
  },
};

const BadgeBackgroundColor = {
  light: {
    primary: 'bg-gray-200',
    secondary: '',
    tertiary: '',
    purple: 'bg-white',
    error: 'bg-error-200',
    warning: 'bg-warning-200',
    success: 'bg-success-200',
  },
  dark: {
    primary: 'bg-neutral-900',
    secondary: '',
    tertiary: '',
    purple: 'bg-gray-light-950',
    error: 'bg-error-600',
    warning: 'bg-warning-600',
    success: 'bg-success-600',
  },
  outlined: {
    primary:
      'border border-primary-200 dark:border-primary-800 bg-primary-100 dark:bg-primary-950',
    secondary:
      'border border-gray-light-200 bg-gray-light-50 dark:bg-gray-dark-900 dark:border-gray-dark-700',
    tertiary:
      'border border-gray-light-300 dark:border-gray-dark-700 bg-white dark:bg-gray-dark-950',
    purple:
      'border border-gray-light-300 dark:border-gray-dark-700 bg-white dark:bg-gray-dark-950',
    error: 'shadow-medium border border-error-300 bg-error-200',
    warning: 'shadow-medium border border-yellow-300 bg-warning-200',
    success:
      'border border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950',
  },
  theme: {
    primary:
      'border border-primary-200 dark:border-primary-800 bg-white dark:bg-gray-dark-900',
    secondary:
      'border border-gray-light-200 bg-white dark:bg-gray-dark-900 dark:border-gray-dark-700',
    tertiary:
      'border border-gray-light-300 dark:border-gray-dark-700 bg-white dark:bg-gray-dark-900',
    purple:
      'border border-gray-light-300 dark:border-gray-dark-700 bg-white dark:bg-gray-dark-900',
    error:
      'shadow-medium border border-error-300 bg-white dark:bg-gray-dark-900',
    warning:
      ' border border-yellow-300 dark:border-[#93370D] bg-white dark:bg-gray-dark-900',
    success:
      'border border-success-200 dark:border-success-800 bg-white dark:bg-gray-dark-900',
  },
};

interface BadgeProps {
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  label?: React.ReactNode;
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'purple'
    | 'error'
    | 'success'
    | 'warning';
  badgeType?: 'light' | 'dark' | 'outlined' | 'theme';
  size?: 'sm' | 'md' | 'lg' | string;
  corners?: 'smooth' | 'sharp' | 'pill';
  flag?: string;
  width?: string;
  className?: string;
  onClick?: () => void;
  cursor?: string;
}

const Badge = ({
  corners = 'smooth',
  badgeType = 'outlined',
  size = 'md',
  color = 'primary',
  rightIcon,
  leftIcon,
  flag,
  label,
  width,
  className = '',
  cursor,
  onClick,
}: BadgeProps) => {
  const newLabel = typeof label === 'string' && label?.replace(/_/g, ' ');

  return (
    <div
      className={`flex items-center justify-center ${
        BadgePadding[size as keyof typeof BadgePadding] ?? size
      } 
        ${CornerTypes[corners]} ${
        GapSize[size as keyof typeof GapSize] ?? size
      } 
        ${BadgeBackgroundColor[badgeType][color]} ${
        BadgeColor[badgeType][color]
      } 
        ${width || ''} ${className}
        cursor-${cursor} `}
      onClick={onClick}
    >
      {leftIcon && (
        <div
          className={`flex items-center justify-center 
            ${IconSize[size as keyof typeof IconSize] ?? size} 
            ${BadgeColor[badgeType][color]}`}
        >
          {leftIcon}
        </div>
      )}

      {flag && (
        <div className="flex items-center justify-center h-5 w-5 rounded-full">
          <Image
            className="rounded-full w-full h-full object-cover"
            src={flag}
            alt="flag"
            width={30}
            height={30}
          />
        </div>
      )}

      <span
        className={`flex items-center ${
          BadgeFontSize[size as keyof typeof BadgeFontSize] ?? size
        } 
          ${BadgeColor[badgeType][color]} whitespace-nowrap`}
      >
        {newLabel || label}
      </span>

      {rightIcon && (
        <div
          className={`flex items-center justify-center 
            ${IconSize[size as keyof typeof IconSize] ?? size} 
            ${BadgeColor[badgeType][color]}`}
        >
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default Badge;
