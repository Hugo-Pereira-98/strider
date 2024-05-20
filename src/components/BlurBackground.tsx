import Button from '@/components/Button';
import { ReactNode } from 'react';
import classNames from 'classnames';

interface BlurBackgroundProps {
  icon: ReactNode;
  title: string;
  description: string;
  labelButton: string;
  hideBlur: boolean;
  onClick?(): void;
  disabled?: boolean;
  lightBlur?: boolean;
  margin?: string;
}

export default function BlurBackground({
  icon,
  title,
  description,
  labelButton,
  onClick,
  hideBlur,
  disabled,
  lightBlur = false,
  margin,
}: BlurBackgroundProps) {
  return (
    <div
      className={classNames(
        { hidden: hideBlur },
        lightBlur
          ? 'bg-white/10 dark:bg-gray-dark-950/10'
          : 'bg-white/40 dark:bg-gray-dark-950/40',
        margin,
        'absolute backdrop-filter backdrop-blur-[8px] rounded-xl inset-0 z-50 flex items-center justify-center'
      )}
    >
      <div className="max-w-[352px] mx-auto text-center">
        <div className="w-12 h-12 flex items-center justify-center mx-auto rounded-xl shadow-extra-small border border-gray-light-200 dark:border-gray-dark-700">
          {icon}
        </div>

        <div className="mt-4 mb-6">
          <p className="body-medium-semibold text-gray-light-950 dark:text-gray-dark-50">
            {title}
          </p>
          <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
            {description}
          </p>
        </div>

        <div className="w-fit mx-auto">
          <Button
            label={labelButton}
            onClick={onClick}
            disabled={disabled}
            buttonType="secondaryGray"
          />
        </div>
      </div>
    </div>
  );
}
