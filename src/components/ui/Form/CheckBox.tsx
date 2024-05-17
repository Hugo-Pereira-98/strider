import { Check } from '@/components/Icons/Check';
import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

interface CheckBoxProps extends ComponentPropsWithoutRef<'input'> {
  name: string;
  label?: string;
  state?: 'active' | 'hovered' | 'focused' | 'disabled';
}

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ name, label, state = 'active', disabled, ...props }, ref) => {
    const { register, watch } = useFormContext();
    const isChecked = watch(name);
    const [interactionState, setInteractionState] = useState(state);
    const finalState = disabled ? 'disabled' : interactionState;

    return (
      <div className="flex items-center gap-2">
        <div
          className={classNames(
            {
              'shadow-focus-primary': finalState === 'focused',
              'shadow-hover-primary': finalState === 'hovered',
            },
            'flex items-center rounded-[4px]'
          )}
          onMouseEnter={() => !disabled && setInteractionState('hovered')}
          onMouseLeave={() => !disabled && setInteractionState('active')}
          onFocus={() => !disabled && setInteractionState('focused')}
          onBlur={() => !disabled && setInteractionState('active')}
        >
          <input
            type="checkbox"
            id={name}
            className="opacity-0 absolute h-4 w-4 z-20"
            {...register(name)}
            {...props} // Use props directly
            ref={ref}
          />
          <div
            className={classNames(
              'rounded-[4px] border h-4 w-4 transition duration-150 ease-in-out flex-shrink-0 flex items-center justify-center',
              {
                'bg-primary-600 border-primary-600': isChecked,
                'border-gray-light-300 dark:border-gray-dark-700': !isChecked,
              }
            )}
          >
            {isChecked && <Check className="text-white" />}
          </div>
        </div>
        {label && <p className="body-medium-medium">{label}</p>}
      </div>
    );
  }
);

CheckBox.displayName = 'CheckBox';

export default CheckBox;
