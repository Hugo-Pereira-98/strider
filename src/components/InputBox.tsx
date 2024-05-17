import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Search } from './Icons/Search';
import { Check } from './Icons/Check';
import { useRouter } from 'next/router';
import { IoBusinessOutline } from 'react-icons/io5';
import { IOrganizationBrandingDTO } from '../dtos';
import { useTheme } from 'next-themes';

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
export type CornerTypes = 'smooth' | 'sharp' | 'pill' | 'rounded';
export type FixedAddonTypes = 'none' | 'left' | 'right';

export interface InputBoxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputTypes;
  feedback?: string;
  feedbackType?: FeedbackTypes;
  state?: StateTypes;
  corners?: CornerTypes;
  fixedAddonType?: FixedAddonTypes;
  labelText?: string;
  placeholder?: string;
  leadIcon?: React.ReactNode;
  trailIcon?: React.ReactNode;
  organizationBranding?: IOrganizationBrandingDTO;
  iconBackground?: boolean;
  margin?: string;
  dropdownItens: any[];
  setValue?: any;
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  (
    {
      type = 'regular',
      feedback = '',
      feedbackType = 'none',
      state = 'active',
      corners = 'smooth',
      fixedAddonType = 'none',
      labelText,
      placeholder,
      disabled,
      leadIcon,
      trailIcon,
      organizationBranding,
      iconBackground = false,
      margin,
      dropdownItens,
      setValue,
      ...props
    },
    ref
  ) => {
    const { resolvedTheme } = useTheme();
    const router = useRouter();
    const listItemRefs = useRef<any>([]);
    const [isFilled, setIsFilled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);

      const handleThemeChange = (e: any) => {
        setIsDarkMode(e.matches);
      };

      mediaQuery.addEventListener('change', handleThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleThemeChange);
      };
    }, []);
    const renderLogoOrIcon = (organizationBranding: any) => {
      let imageToUse =
        resolvedTheme === 'dark'
          ? organizationBranding?.symbolLight || organizationBranding?.icon
          : organizationBranding?.symbolDark || organizationBranding?.icon;

      return (
        <div className="rounded-sm flex items-center justify-center w-[30px] h-[30px] p-1">
          {imageToUse ? (
            <Image
              src={imageToUse}
              width={30}
              height={30}
              alt="Organization Branding"
            />
          ) : (
            <IoBusinessOutline className="w-6 h-6 text-gray-600" />
          )}
        </div>
      );
    };

    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const dropdownRef = useRef(null);

    const handleKeyDown = (e: any) => {
      if (e.key === 'ArrowDown' && !dropdownVisible) {
        e.preventDefault();
        setDropdownVisible(true);

        setSelectedItemIndex(0);
        return;
      }

      if (!dropdownVisible) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedItemIndex((prevIndex) =>
          Math.min(prevIndex + 1, dropdownItens.length - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedItemIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.key === 'Enter' && selectedItemIndex >= 0) {
        e.preventDefault();

        const selectedItem = dropdownItens[selectedItemIndex];
        setValue('company.title', selectedItem?.name);
        setValue(
          'company.logo',
          selectedItem?.organizationBranding?.defaultLogo
        );
        setValue('company.id', selectedItem?.company?.id);
        setValue(
          'company.organizationBranding',
          selectedItem?.organizationBranding
        );
        setValue('company.subtitle', selectedItem?.company?.subtitle);
        setDropdownVisible(false);
      } else if (e.key === 'Escape') {
        setDropdownVisible(false);
      }

      if (
        (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
        selectedItemIndex >= 0
      ) {
        const currentItemRef = listItemRefs.current[selectedItemIndex];
        if (currentItemRef) {
          const dropdownElement: any = dropdownRef.current;
          if (
            e.key === 'ArrowDown' &&
            currentItemRef.offsetTop + currentItemRef.offsetHeight >
              dropdownElement.scrollTop + dropdownElement.offsetHeight
          ) {
            dropdownElement.scrollTop =
              currentItemRef.offsetTop +
              currentItemRef.offsetHeight -
              dropdownElement.offsetHeight;
          } else if (
            e.key === 'ArrowUp' &&
            currentItemRef.offsetTop < dropdownElement.scrollTop
          ) {
            dropdownElement.scrollTop = currentItemRef.offsetTop;
          }
        }
      }
    };

    useEffect(() => {
      if (router.query) {
        setValue('company', {
          id: +router.query.id!,
          title: router.query.title,
          logo: router.query.logo,
          subtitle: router.query.subtitle,
        });
      }
    }, []);

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [dropdownVisible, selectedItemIndex]);

    const handleMouseEnter = () => {
      if (finalState !== 'disabled' && finalState !== 'viewOnly') {
        setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      if (finalState !== 'disabled' && finalState !== 'viewOnly') {
        setIsHovered(false);
      }
    };

    const handleFocus = () => {
      if (finalState !== 'disabled' && finalState !== 'viewOnly') {
        setIsFocused(true);
      }
    };
    const handleBlur = () => {
      setIsFocused(false);
      setTimeout(() => setDropdownVisible(false), 80);
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (finalState === 'disabled' || finalState === 'viewOnly') return;

      if (!e.target.value) {
        setValue('company', null);
      }

      const isInputFilled = e.target.value !== '';
      setIsFilled(isInputFilled);
      if (props.onChange) {
        setDropdownVisible(true);
        props.onChange(e);
      }
    };

    let finalState = state;
    if (disabled) finalState = 'disabled';
    else if (isFilled) finalState = 'filled';
    else if (isFocused) finalState = 'focused';
    else if (isHovered) finalState = 'hover';

    const iconDivStyles = {
      // display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '35px',
      height: '100%',
    };

    const cornersPatterns = {
      sharp: 'rounded-none',
      smooth: 'rounded-md',
      rounded: 'rounded-md',
      pill: 'rounded-full',
    };

    const leadIconCornersPatterns = {
      sharp: 'rounded-l-none',
      smooth: 'rounded-md',
      rounded: 'rounded-l-lg',
      pill: 'rounded-l-full',
    };

    const disabledShadowClasses = {
      none: 'shadow-medium',
      error: 'shadow-medium',
      success: 'shadow-medium',
      warning: 'shadow-medium',
    };

    const viewOnlyShadowClasses = {
      none: 'shadow-medium',
      error: 'shadow-medium',
      success: 'shadow-medium',
      warning: 'shadow-medium',
    };

    const hoverShadowClasses = {
      none: 'shadow-hover-primary',
      error: 'shadow-hover-error',
      success: 'shadow-hover-success',
      warning: 'shadow-hover-warning',
    };

    const activeShadowClasses = {
      none: 'shadow-hover-secondary',
      error: 'shadow-hover-error',
      success: 'shadow-hover-success',
      warning: 'shadow-hover-warning',
    };

    const focusShadowClasses = {
      none: 'shadow-focus-primary',
      error: 'shadow-focus-error',
      success: 'shadow-focus-success',
      warning: 'shadow-focus-warning',
    };

    return (
      <div className="w-full relative">
        <div
          className={`w-full ${cornersPatterns[corners]} relative bg-transparent`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`relative bg-transparent`}>
            {organizationBranding ? (
              <div
                className={`absolute left-[10px] z-10 items-center ${leadIconCornersPatterns[corners]} flex h-full`}
                style={iconDivStyles}
              >
                {renderLogoOrIcon(organizationBranding)}
              </div>
            ) : (
              <>
                {leadIcon ? (
                  <div
                    className={`absolute -translate-y-1/2 top-[30px] left-[10px] z-10 items-center ${leadIconCornersPatterns[corners]}`}
                    style={iconDivStyles}
                  >
                    <div className="bg-white rounded-sm w-7">{leadIcon}</div>
                  </div>
                ) : (
                  <div className="absolute top-1/2 -translate-y-1/2 z-10 left-[14px]">
                    <Search className="stroke-gray-light-500 dark:stroke-gray-dark-400" />
                  </div>
                )}
              </>
            )}

            <input
              ref={ref}
              type="text"
              placeholder={placeholder}
              disabled={disabled || finalState === 'disabled'}
              readOnly={finalState === 'viewOnly'}
              className={`relative w-full py-[9px] pl-11 px-[14px] text-gray-light-950 dark:text-gray-dark-50 body-medium-medium placeholder:body-medium-regular placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-400 focus:outline-none dark:bg-gray-dark-950 ${
                cornersPatterns[corners]
              } ${
                isHovered
                  ? hoverShadowClasses[feedbackType]
                  : isFocused
                  ? focusShadowClasses[feedbackType]
                  : finalState === 'active' || finalState === 'filled'
                  ? activeShadowClasses[feedbackType]
                  : finalState === 'disabled'
                  ? disabledShadowClasses[feedbackType]
                  : finalState === 'viewOnly'
                  ? viewOnlyShadowClasses[feedbackType]
                  : ''
              }`}
              {...props}
              autoFocus={true}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={() => !isFilled && setDropdownVisible(true)}
              onChange={handleOnChange}
            />
          </div>
        </div>

        {dropdownVisible && (
          <div
            ref={dropdownRef}
            className="shadow-large border border-gray-light-200 dark:border-gray-dark-700 rounded-md overflow-auto max-h-80 absolute z-10 w-full bg-white dark:bg-gray-dark-950 mt-1 scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-96 scrollbar-w-2"
          >
            <ul className="m-2 space-y-1">
              {dropdownItens?.length > 0 ? (
                dropdownItens.map((item, index) => (
                  <li
                    ref={(el) => (listItemRefs.current[index] = el)}
                    key={index}
                    className={classNames(
                      {
                        'bg-gray-light-50 dark:bg-gray-dark-900':
                          index === selectedItemIndex ||
                          dropdownItens.length === 1,
                      },
                      'hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 dark:text-gray-dark-300 p-2 flex justify-between rounded-md cursor-pointer items-center transition-all duration-100'
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setValue('company', {
                        id: item.company?.id,
                        title: item.name,
                        organizationBranding: item.organizationBranding,
                        subtitle: item.company?.subtitle,
                      });
                      setSelectedItemIndex(index);
                      setDropdownVisible(false);
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      {renderLogoOrIcon(item.organizationBranding)}
                      {item.name}
                    </div>

                    {(index === selectedItemIndex ||
                      dropdownItens.length === 1) && (
                      <Check className="stroke-primary-600" />
                    )}
                  </li>
                ))
              ) : (
                <p>No companies found.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

InputBox.displayName = 'InputBox';

export default InputBox;
