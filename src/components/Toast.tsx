import { ReactNode, useEffect, useState } from 'react';
import { Close } from './Icons/Close';
import Image from 'next/image';

export type Toast = {
  type?: 'success' | 'danger' | 'warning';
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
};

export function Toast({
  type = 'success',
  title,
  description,
  action,
  onClose,
}: Toast) {
  const [animationClass, setAnimationClass] = useState('animate-slideIn');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationClass('animate-slideOut');
      if (onClose) {
        setTimeout(onClose, 300);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`p-4 pl-2 bg-white dark:bg-gray-dark-900 w-[300px] md:w-[400px] rounded-xl fixed top-4 right-4 z-[99999] shadow-large border border-gray-light-300 dark:border-gray-dark-700 flex gap-2 ${animationClass}`}
    >
      <button className="absolute right-4 top-4" onClick={onClose}>
        <Close />
      </button>

      <div>
        {type === 'success' && (
          <Image
            src="/assets/check-outline.svg"
            width={38}
            height={38}
            className="-mt-2"
            alt=""
          />
        )}
      </div>
      <div>
        {title && (
          <div className="text-gray-light-950 dark:text-gray-dark-50 body-small-semibold">
            {title}
          </div>
        )}
        {description && (
          <div className="body-small-regular text-gray-light-700 dark:text-gray-dark-300">
            {description}
          </div>
        )}
        {action}
      </div>
    </div>
  );
}
