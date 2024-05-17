import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  indicator?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  indicator = true,
}) => {
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  return (
    <div className="flex flex-col items-start w-full gap-2">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="relative w-full h-2 bg-gray-100 rounded-full">
          <div
            style={{ width: `calc(max(6px, ${percentage}%))` }}
            className="h-full bg-primary-600 rounded-full transition-width duration-200 ease-in-out"
          />
        </div>
        {!label && indicator && (
          <span className="body-extra-small-medium text-gray-500">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
      {label && (
        <div className="flex items-center justify-between w-full">
          <p className="body-extra-small-medium text-gray-500">{label}</p>
          <span className="body-extra-small-medium text-gray-500">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
