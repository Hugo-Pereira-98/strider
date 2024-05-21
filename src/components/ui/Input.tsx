import React, { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';

export type InputTypes =
  | 'regular'
  | 'phone'
  | 'url'
  | 'payment'
  | 'password'
  | 'number';
export type StateTypes =
  | 'active'
  | 'hover'
  | 'focused'
  | 'filled'
  | 'disabled'
  | 'viewOnly';
export type FeedbackTypes = 'none' | 'error' | 'success' | 'warning';
export type CornerTypes =
  | 'smooth'
  | 'sharp'
  | 'pill'
  | 'rounded'
  | 'sharpLeft'
  | 'sharpRight';
export type FixedAddonTypes = 'none' | 'left' | 'right';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputTypes;
  feedback?: string;
  feedbackType?: FeedbackTypes;
  state?: StateTypes;
  corners?: CornerTypes;
  fixedAddonType?: FixedAddonTypes;
  fixedAddonContent?: React.ReactNode;
  labelText?: string;
  placeholder?: string;
  helpText?: string;
  helpIcon?: React.ReactNode;
  leadIcon?: React.ReactNode;
  trailIcon?: React.ReactNode;
  iconBackground?: boolean;
  passwordStrength?: number;
  strengthIndicator?: boolean;
  margin?: string;
  customLead?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      type = 'regular',
      feedback = '',
      feedbackType = 'none',
      state = 'active',
      corners = 'smooth',
      fixedAddonType = 'none',
      fixedAddonContent,
      labelText,
      placeholder,
      disabled,
      leadIcon,
      trailIcon,
      iconBackground = false,
      helpText,
      passwordStrength = 0,
      strengthIndicator,
      margin,
      customLead,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [strength, setStrength] = useState(passwordStrength);
    const [isFilled, setIsFilled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleMouseEnter = () => {
      if (
        finalState !== 'disabled' &&
        finalState !== 'viewOnly' &&
        finalState !== 'focused'
      ) {
        setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleFocus = () => {
      if (finalState !== 'disabled' && finalState !== 'viewOnly') {
        setIsFocused(true);
        setIsHovered(false);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
    };
    const togglePasswordVisibility = () => {
      if (finalState === 'disabled' || finalState === 'viewOnly') return;
      setIsPasswordVisible(!isPasswordVisible);
    };

    const checkPasswordStrength = (password: string) => {
      let strength = 0;
      if (password.length > 0) strength++;
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
      if (password.match(/[0-9]/)) strength++;
      if (password.match(/[^A-Za-z0-9]/)) strength++;

      setStrength(strength);
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (finalState === 'disabled' || finalState === 'viewOnly') return;

      const isInputFilled = e.target.value !== '';
      checkPasswordStrength(e.target.value);
      setIsFilled(isInputFilled);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    let finalState = state;
    if (disabled) finalState = 'disabled';
    else if (isFocused) finalState = 'focused';
    else if (isFilled) finalState = 'filled';
    else if (isHovered) finalState = 'hover';

    const iconDivStyles = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '35px',
      height: '100%',
      backgroundColor: iconBackground ? '#F3F4F6' : 'transparent',
    };

    const cornersPatterns = {
      sharpRight: 'rounded-r-none rounded-md',
      sharpLeft: 'rounded-l-none rounded-md',
      sharp: 'rounded-none',
      smooth: 'rounded-md',
      rounded: 'rounded-md',
      pill: 'rounded-full',
    };

    const trailIconCornersPatterns = {
      sharpRight: '',
      sharpLeft: '',
      sharp: 'rounded-r-none',
      smooth: 'rounded-md',
      rounded: 'rounded-r-lg',
      pill: 'rounded-r-full',
    };
    const leadIconCornersPatterns = {
      sharpRight: '',
      sharpLeft: '',
      sharp: 'rounded-l-none',
      smooth: 'rounded-md',
      rounded: 'rounded-l-lg',
      pill: 'rounded-l-full',
    };

    const disabledShadowClasses = {
      none: 'shadow-extra-small',
      error: 'shadow-extra-small',
      success: 'shadow-extra-small',
      warning: 'shadow-extra-small',
    };

    const viewOnlyShadowClasses = {
      none: 'shadow-medium',
      error: 'shadow-medium',
      success: 'shadow-medium',
      warning: 'shadow-medium',
    };

    const hoverShadowClasses = {
      none: 'shadow-hover-primary',
      error: 'shadow-hover-primary',
      success: 'shadow-hover-success',
      warning: 'shadow-hover-warning',
    };

    const focusShadowClasses = {
      none: 'shadow-focus-primary',
      error: 'shadow-focus-error',
      success: 'shadow-focus-success',
      warning: 'shadow-focus-warning',
    };

    useEffect(() => {
      if (type === 'password' && typeof props.value === 'string') {
        checkPasswordStrength(props.value);
      }
    }, [props.value, type]);

    return (
      <div className="w-full">
        {labelText && (
          <label className="block body-small-medium text-gray-light-700 dark:text-gray-dark-300 mb-[6px]">
            {labelText}
          </label>
        )}
        <div
          className={`w-full ${cornersPatterns[corners]}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`relative bg-transparent`}>
            {leadIcon && (
              <div
                className={`absolute inset-y-0 ${
                  customLead ? 'left-6' : 'left-[5px]'
                } flex items-center ${leadIconCornersPatterns[corners]} z-50`}
                style={iconDivStyles}
              >
                {leadIcon}
              </div>
            )}
            <input
              ref={ref}
              type={
                type === 'password'
                  ? isPasswordVisible
                    ? 'text'
                    : 'password'
                  : type ?? 'text'
              }
              placeholder={placeholder}
              disabled={disabled || finalState === 'disabled'}
              readOnly={finalState === 'viewOnly'}
              className={`relative w-full py-[9px] bg-white dark:bg-gray-dark-950 text-gray-light-950 dark:text-gray-dark-50 body-medium-regular placeholder:body-medium-regular placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-500 focus:outline-none ${
                cornersPatterns[corners]
              } ${
                corners === 'sharpLeft'
                  ? 'border-l-none border-r border-t border-b'
                  : 'border'
              } ${
                feedbackType === 'error'
                  ? 'border-red-300 dark:border-red-400'
                  : 'border-gray-light-300 dark:border-gray-dark-700'
              } ${
                leadIcon && !customLead
                  ? 'pl-10'
                  : leadIcon && customLead
                  ? 'pl-[90px]'
                  : 'pl-[14px]'
              } ${trailIcon || type === 'password' ? 'pr-10' : 'pr-[14px]'} ${
                isHovered
                  ? hoverShadowClasses[feedbackType]
                  : isFocused
                  ? `${focusShadowClasses[feedbackType]} ${
                      feedbackType !== 'error'
                        ? 'border-primary-300 dark:border-primary-400'
                        : ''
                    } z-10`
                  : finalState === 'active' || finalState === 'filled'
                  ? 'shadow-extra-small'
                  : finalState === 'disabled'
                  ? `${disabledShadowClasses[feedbackType]} text-gray-light-500 dark:text-gray-dark-500 dark:bg-gray-dark-900 dark:border-gray-dark-700`
                  : finalState === 'viewOnly'
                  ? viewOnlyShadowClasses[feedbackType]
                  : ''
              }`}
              {...props}
              autoFocus={true}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleOnChange}
            />

            {type === 'password' && (
              <div
                className="absolute inset-y-0 right-0 flex text-gray-light-400 items-center pr-3 cursor-pointer z-10"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </div>
            )}
            {trailIcon && (
              <div
                className={`absolute inset-y-0 right-0 flex items-center ${trailIconCornersPatterns[corners]}`}
                style={iconDivStyles}
              >
                {trailIcon}
              </div>
            )}
          </div>
        </div>
        {strengthIndicator && (
          <div className="mt-1 flex justify-between items-center">
            {strength === 1 && (
              <div className="w-1/3 h-[6px] rounded bg-red-500 mr-1"></div>
            )}
            {strength === 2 && (
              <div className="w-full flex gap-2">
                <div className="w-1/3 h-[6px] rounded bg-yellow-500 mr-1"></div>
                <div className="w-1/3 h-[6px] rounded bg-yellow-500 mr-1"></div>
              </div>
            )}
            {strength > 2 && (
              <div className="w-full flex gap-2">
                <div className="w-1/3 h-[6px] rounded bg-green-500"></div>
                <div className="w-1/3 h-[6px] rounded bg-green-500"></div>
                <div className="w-1/3 h-[6px] rounded bg-green-500"></div>
              </div>
            )}
            <div
              className={`ml-2 body-small-regular ${
                strength === 1
                  ? 'text-red-500'
                  : strength === 2
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              {strength === 1 && 'Weak'}
              {strength === 2 && 'Intermediate'}
              {strength > 2 && 'Strong'}
            </div>
          </div>
        )}
        {feedback && (
          <div
            className={`${
              feedbackType === 'error'
                ? 'text-error-600 dark:text-error-400'
                : ''
            } body-small-regular flex items-center mt-[6px] dark:text-gray-dark-400`}
          >
            {feedback}
          </div>
        )}

        {helpText && (
          <div className="body-small-medium text-neutral-600 flex items-center mt-1">
            <HiOutlineQuestionMarkCircle className="mr-1" />
            {helpText}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
