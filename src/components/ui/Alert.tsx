import React, { useEffect, useState } from 'react';
import {
  HiArrowRight,
  HiOutlineInformationCircle,
  HiXMark,
} from 'react-icons/hi2';

interface AlertProps {
  type?: 'primary' | 'error' | 'warning' | 'success';
  background?: 'dark' | 'light';
  corners?: 'smooth' | 'sharp' | 'pill';
  leftIcon?: React.ReactNode;
  rightIconClose?: boolean;
  headLineText?: string;
  supportingText?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  margin?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type = 'primary',
  background = 'light',
  leftIcon = <HiOutlineInformationCircle size={20} />,
  rightIconClose = true,
  headLineText,
  supportingText,
  buttonText,
  buttonIcon = <HiArrowRight size={18} />,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  const [slideOut, setSlideOut] = useState(false);

  useEffect(() => {
    const slideOutTimer = setTimeout(() => {
      setSlideOut(true);
    }, 3000);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3500);

    return () => {
      clearTimeout(slideOutTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  const AlertBackgroundColor = {
    light: {
      primary: 'bg-white',
      error: 'bg-error-50',
      warning: 'bg-warning-50',
      success: 'bg-success-50',
    },
    dark: {
      primary: 'bg-neutral_600',
      error: 'bg-error-600',
      warning: 'bg-warning-600',
      success: 'bg-success-600',
    },
  };

  const AlertBoxShadow = {
    light: {
      primary: 'shadow-medium',
      error: 'shadow-focus-error',
      warning: 'shadow-focus-warning',
      success: 'shadow-focus-success',
    },
    dark: {
      primary: 'shadow-medium',
      error: 'shadow-focus-error',
      warning: 'shadow-focus-warning',
      success: 'shadow-focus-success',
    },
  };

  const AlertTextColor = {
    light: {
      primary: 'text-gray_500',
      error: 'text-error-600',
      warning: 'text-warning-600',
      success: 'text-success-600',
    },
    dark: {
      primary: 'text-white',
      error: 'text-white',
      warning: 'text-white',
      success: 'text-white',
    },
  };

  return (
    <div
      className={`fixed top-0 right-4 py-3 px-4 mt-4 flex gap-2 max-w-lg rounded transform transition-transform duration-300 ease-in-out
			${AlertBackgroundColor[background][type]} 
			${AlertTextColor[background][type]} 
			${AlertBoxShadow[background][type]}
			${slideOut ? 'animate-slideOut' : 'animate-slideIn'}`}
    >
      <div className="mt-0.5">{leftIcon}</div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col mr-6">
          <div className="body-medium-semibold">{headLineText}</div>
          <div className="text-left body-small-regular">{supportingText}</div>
        </div>
        {buttonText && (
          <button className="body-small-regular flex items-center gap-2">
            {buttonText}
            {buttonIcon}
          </button>
        )}
      </div>
      {rightIconClose && (
        <div
          className="absolute right-2 top-2 cursor-pointer"
          onClick={() => {
            setVisible(false);
            onClose && onClose();
          }}
        >
          <HiXMark size={20} />
        </div>
      )}
    </div>
  );
};

export default Alert;
