import React, { ButtonHTMLAttributes, useState } from 'react';

import { Spinner } from './ui/Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | number;
  loading?: boolean;
  width?: string;
  labelColor?: string;
  transparent?: boolean;
  rightIcon?: React.ReactElement;
  leftIcon?: React.ReactElement;
  disabled?: boolean;
  buttonType?:
    | 'primary'
    | 'secondary'
    | 'secondaryGray'
    | 'outline'
    | 'textOnly'
    | 'danger'
    | 'success';

  state?: 'active' | 'hover' | 'focused' | 'disabled';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  corners?: 'smooth' | 'sharp' | 'pill' | 'rounded';
  loadingWheel?: boolean;
}

export default function Button({
  label,
  loading,
  width = 'w-full',
  labelColor,
  rightIcon,
  leftIcon,
  disabled,
  buttonType = 'primary',
  state = 'active',
  size = 'sm',
  corners = 'smooth',
  loadingWheel = true,
  ...rest
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const handleMouseDown = () => {
    setIsFocused(true);
  };

  const handleMouseUp = () => {
    setIsFocused(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  let finalState = state;
  if (disabled) {
    finalState = 'disabled';
  } else if (isFocused) {
    finalState = 'focused';
  } else if (isHovered) {
    finalState = 'hover';
  }

  const buttonTextColor = {
    active: {
      primary: 'text-white',
      secondary: 'text-neutral-600',
      secondaryGray: 'text-gray-light-700 dark:text-gray-dark-300',
      outline: 'text-neutral-600',
      textOnly: 'text-neutral-600 dark:text-gray-dark-400',
      danger: 'text-white',
      success: 'text-white',
    },
    hover: {
      primary: 'text-white',
      secondary: 'text-neutral-600',
      secondaryGray: 'text-gray-light-800 dark:text-gray-dark-300',
      outline: 'text-neutral-600',
      textOnly: 'text-neutral-600 dark:text-gray-dark-400',
      danger: 'text-white',
      success: 'text-white',
    },
    focused: {
      primary: 'text-white',
      secondary: 'text-neutral-600',
      secondaryGray: 'text-neutral-600 dark:text-gray-dark-300',
      outline: 'text-neutral-600',
      textOnly: 'text-neutral-600',
      danger: 'text-white',
      success: 'text-white',
    },
    disabled: {
      primary: 'text-gray-300',
      secondary: 'text-gray-300',
      secondaryGray: 'text-gray-300',
      outline: 'text-gray-300',
      textOnly: 'text-gray-300',
      danger: 'text-error-800',
      success: 'text-gray-300',
    },
  };

  const buttonBoxShadow = {
    active: {
      primary: 'shadow-extra-small',
      secondary: 'shadow-medium',
      secondaryGray: 'shadow-medium',
      outline: 'shadow-medium',
      textOnly: 'shadow-none',
      danger: 'shadow-medium',
      success: 'shadow-medium',
    },
    hover: {
      primary: 'shadow-none',
      secondary: 'shadow-hover-secondary',
      secondaryGray: 'shadow-hover-secondary',
      outline: 'shadow-hover-secondary',
      textOnly: 'shadow-none',
      danger: 'shadow-hover-error',
      success: 'shadow-hover-success',
    },
    focused: {
      primary: 'shadow-focus-primary',
      secondary: 'shadow-focus-secondary',
      secondaryGray: 'shadow-focus-secondary',
      outline: 'shadow-focus-secondary',
      textOnly: 'shadow-none',
      danger: 'shadow-focus-error',
      success: 'shadow-focus-success',
    },
    disabled: {
      primary: 'shadow-extra-small',
      secondary: 'shadow-medium',
      secondaryGray: 'shadow-medium',
      outline: 'shadow-medium',
      textOnly: 'shadow-none',
      danger: 'shadow-medium',
      success: 'shadow-medium',
    },
  };

  const buttonBackgroundColor = {
    active: {
      primary: 'bg-primary-600',
      secondary: 'bg-white',
      secondaryGray: 'bg-white dark:bg-gray-dark-900',
      outline: 'bg-transparent',
      textOnly: 'bg-transparent',
      danger: 'bg-error-600',
      success: 'bg-success-600',
    },
    hover: {
      primary: 'bg-primary-700',
      secondary: 'bg-gray-100',
      secondaryGray: 'bg-gray-light-50 dark:bg-gray-dark-800',
      outline: 'bg-transparent',
      textOnly: 'bg-transparent',
      danger: 'bg-error-700',
      success: 'bg-success-700',
    },
    focused: {
      primary: 'bg-primary-600',
      secondary: 'bg-white',
      secondaryGray: 'bg-gray-50 dark:bg-gray-dark-900',
      outline: 'bg-transparent',
      textOnly: 'bg-transparent',
      danger: 'bg-error-600',
      success: 'bg-success-600',
    },
    disabled: {
      primary: 'bg-gray-light-100 dark:bg-gray-dark-800',
      secondary: 'bg-white',
      secondaryGray: 'bg-gray-50 dark:bg-gray-dark-950',
      outline: 'bg-transparent',
      textOnly: 'bg-transparent',
      danger: 'bg-error-300',
      success: 'bg-success-300',
    },
  };

  const cornersPatterns = {
    sharp: 'rounded-none',
    smooth: 'rounded-md',
    rounded: 'rounded-2xl',
    pill: 'rounded-full',
  };

  let spinnerColor: 'white' | 'black' = 'black';
  if (disabled) {
    spinnerColor = 'black';
  } else if (buttonType === 'primary' || buttonType === 'danger') {
    spinnerColor = 'white';
  }

  return (
    <button
      type={rest.type ?? 'button'}
      className={`py-2 px-4 lg:py-[9px] lg:px-[14px] group border gap-2 ${
        rest.className
      } ${buttonTextColor[finalState][buttonType]} ${
        buttonBackgroundColor[finalState][buttonType]
      } ${buttonBoxShadow[finalState][buttonType]} ${
        cornersPatterns[corners]
      } flex items-center justify-center outline-none disabled:text-gray-light-400 dark:disabled:text-gray-dark-500 disabled:border-inherit dark:disabled:border-gray-dark-800 ${width} ${
        buttonType === 'textOnly'
          ? 'border-transparent'
          : buttonType === 'secondaryGray'
          ? 'border-gray-light-200 dark:border-gray-dark-700 focus:border-gray-light-300 dark:focus:border-gray-dark-700'
          : buttonType === 'primary'
          ? 'border-primary-600'
          : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={rest.onClick}
      disabled={disabled || finalState === 'disabled'}
    >
      {loadingWheel && loading ? (
        <Spinner color={spinnerColor} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <span
            className={`whitespace-nowrap body-small-semibold size-${size} text-${
              labelColor ?? buttonTextColor[finalState][buttonType]
            }`}
          >
            {label}
          </span>
          {rightIcon && (
            <div className={`icon-container size-${size}`}>
              {React.cloneElement(rightIcon)}
            </div>
          )}
        </>
      )}
    </button>
  );
}
