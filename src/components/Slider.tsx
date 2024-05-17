import { Controller } from 'react-hook-form';

interface SliderProps {
  label?: string;
  name: string;
  control: any;
  defaultValue?: string | number;
  minStep?: number;
  maxStep?: number;
  customLabelValue?: string;
}

export function Slider({
  label,
  name,
  control,
  defaultValue = '',
  minStep = 0,
  maxStep = 100,
  customLabelValue,
}: SliderProps) {
  const getPercentage = (value: number) => {
    return ((value - minStep) / (maxStep - minStep)) * 100;
  };

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="body-small-medium text-gray-light-700 dark:text-gray-dark-300 block">
            {label}
          </label>
          {customLabelValue && +defaultValue > 0 ? (
            <span className="body-small-medium text-gray-light-950 dark:text-gray-dark-50">
              {customLabelValue}
            </span>
          ) : (
            <span className="body-small-medium text-gray-light-950 dark:text-gray-dark-50">
              {defaultValue}%
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <div className="w-full h-2 bg-gray-light-200 dark:bg-gray-dark-700 rounded-full relative overflow-hidden">
          <div
            className="absolute left-0 h-2 bg-primary-600 dark:bg-primary-500"
            style={{ width: `${getPercentage(+defaultValue)}%` }}
          />
        </div>

        <span
          className="absolute top-0 -mt-1.5 ml-[-8px] w-5 h-5 bg-white dark:bg-primary-500 border-2 border-primary-600 dark:border-gray-dark-950 rounded-full cursor-pointer shadow-medium"
          style={{ left: `${getPercentage(+defaultValue)}%` }}
        />

        <Controller
          name={name}
          control={control}
          defaultValue={+defaultValue}
          render={({ field }) => (
            <input
              type="range"
              min={minStep}
              max={maxStep}
              value={field.value}
              onChange={field.onChange}
              className="absolute top-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
        />
      </div>
    </div>
  );
}
