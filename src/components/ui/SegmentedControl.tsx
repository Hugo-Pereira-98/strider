import React, { ButtonHTMLAttributes, useState } from 'react';
import { Spinner } from './Spinner';

interface SegmentedControlProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick: () => void;
  loading?: boolean;
  width?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  corners?: 'smooth' | 'sharp' | 'pill' | 'rounded';
  rightCorner?: 'smooth' | 'sharp' | 'pill' | 'rounded';
  leftCorner?: 'smooth' | 'sharp' | 'pill' | 'rounded';
}

export const SegmentedControl = ({
  label,
  onClick,
  loading = false,
  width = 'w-auto',
  rightIcon,
  leftIcon,
  disabled = false,
  size = 'sm',
  corners = 'smooth',
  rightCorner,
  leftCorner,
  ...rest
}: SegmentedControlProps) => {
  const handleClick = () => {
    onClick();
  };

  const sizeClasses = {
    sm: 'px-3 py-3',
    md: 'px-4 py-4',
    lg: 'px-6 py-6',
    xl: 'px-8 py-8',
  };

  const rightCornersClasses = {
    smooth: 'rounded-r-md',
    sharp: 'rounded-r-none',
    pill: 'rounded-r-full',
    rounded: 'rounded-r-lg',
  };

  const leftCornersClasses = {
    smooth: 'rounded-l-md',
    sharp: 'rounded-l-none',
    pill: 'rounded-l-full',
    rounded: 'rounded-l-lg',
  };

  const disabledClass = disabled
    ? 'cursor-not-allowed pointer-events-none'
    : '';

  return (
    <button
      className={`flex flex-row items-center justify-center ${width} transition-all duration-200 ${disabledClass} ${
        sizeClasses[size]
      } ${leftIcon && leftCornersClasses[corners]} ${
        rightIcon && rightCornersClasses[corners]
      } 
    
    bg-white shadow-medium text-neutral-600 hover:bg-gray-100 hover:text-gray-900 active:bg-primary-600 active:text-white
    disabled:bg-white disabled:shadow-medium disabled:text-gray-300`}
      {...rest}
      onClick={handleClick}
      disabled={disabled}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {leftIcon && <div className={`${label && 'mr-2'}`}>{leftIcon}</div>}
          <span className="flex items-center justify-center text-center body-small-semibold">
            {label}
          </span>

          {rightIcon && <div className={`${label && 'ml-2'}`}>{rightIcon}</div>}
        </>
      )}
    </button>
  );
};
