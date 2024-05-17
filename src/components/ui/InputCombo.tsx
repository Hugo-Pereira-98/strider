import React, {
  useState,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from 'react';
import { Check } from '../Icons/Check';
import Image from 'next/image';
import { IOrganizationBrandingDTO, IOrganizationDTO } from '../../dtos';
import { IoBusinessOutline } from 'react-icons/io5';
import { Search } from '../Icons/Search';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';

export type StateTypes =
  | 'active'
  | 'hover'
  | 'focused'
  | 'filled'
  | 'disabled'
  | 'viewOnly';
export type FeedbackTypes = 'none' | 'error' | 'success' | 'warning';
export type CornerTypes = 'smooth' | 'sharp' | 'pill' | 'rounded';

interface InputComboProps {
  options: any[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  width?: string;
  placeholder?: string;
  feedbackType?: FeedbackTypes;
  corners?: CornerTypes;
  state?: StateTypes;
  organizationBranding?: IOrganizationBrandingDTO;
  leadIcon?: React.ReactNode;
  setValue?: any;
  defaultValue?: string;
}

export default function InputCombo({
  options,
  onSelect,
  disabled = false,
  width = 'w-full',
  placeholder,
  feedbackType = 'none',
  corners = 'smooth',
  state = 'active',
  organizationBranding,
  setValue,
  defaultValue,
  leadIcon,
}: InputComboProps) {
  const [selectedOption, setSelectedOption] = useState<IOrganizationDTO>(
    {} as any
  );
  const [inputValue, setInputValue] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const { resolvedTheme } = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const router = useRouter();
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

  const handleSelect = (option: any) => {
    onSelect(option);
    setSelectedOption(option);
    setDropdownVisible(false);
    setInputValue(defaultValue ?? option?.name);

    setValue('company.title', option?.name);
    setValue('company.logo', option?.defaultLogo);
    setValue('company.id', option?.id);
    setValue('company.organizationBranding', option?.organizationBranding);
    setValue('company.subtitle', option?.subtitle);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setDropdownVisible(true);
    setHighlightedIndex(0);

    if (event.target.value) {
      setValue('company', null);
    }
  };

  useEffect(() => {
    if (router.query) {
      setValue('company', {
        id: +router.query.id!,
        title: router.query.title,
        logo:
          resolvedTheme === 'dark'
            ? router.query.symbolLight || organizationBranding?.icon
            : router.query.symbolDark || organizationBranding?.icon,
        subtitle: router.query.subtitle,
      });
    }
  }, []);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    let newHighlightedIndex = highlightedIndex; // Keep track of the new index

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setDropdownVisible(true);
      newHighlightedIndex = (highlightedIndex + 1) % filteredOptions.length;
      setHighlightedIndex(newHighlightedIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setDropdownVisible(true);
      newHighlightedIndex =
        highlightedIndex > 0
          ? highlightedIndex - 1
          : filteredOptions.length - 1;
      setHighlightedIndex(newHighlightedIndex);
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      if (filteredOptions.length > 0) {
        const selectedOption = filteredOptions[highlightedIndex];
        handleSelect(selectedOption);
        setDropdownVisible(false);
      }
    } else if (event.key === 'Escape') {
      setDropdownVisible(false);
    }

    // After updating the index, ensure the new highlighted item is visible
    setTimeout(() => scrollToItem(newHighlightedIndex), 0);
  };

  const scrollToItem = (index: number) => {
    const dropdownElement = dropdownRef.current;
    const itemElement = itemRefs.current[index];

    if (itemElement && dropdownElement) {
      const dropdownTop = dropdownElement.scrollTop;
      const dropdownBottom = dropdownTop + dropdownElement.offsetHeight;
      const itemTop = itemElement.offsetTop;
      const itemBottom = itemTop + itemElement.offsetHeight;

      if (itemBottom > dropdownBottom) {
        dropdownElement.scrollTop = itemBottom - dropdownElement.offsetHeight;
      } else if (itemTop < dropdownTop) {
        dropdownElement.scrollTop = itemTop;
      }
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  let finalState = state;
  if (disabled) finalState = 'disabled';
  else if (isFilled) finalState = 'filled';
  else if (isFocused) finalState = 'focused';
  else if (isHovered) finalState = 'hover';

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

  return (
    <div className="w-full relative">
      <div
        className={`relative ${width} ${disabled ? 'cursor-not-allowed' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col">
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
            value={defaultValue ?? inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={() => setDropdownVisible(true)}
            placeholder={placeholder}
            className={`relative w-full py-[9px] pl-11 px-[14px] text-gray-light-950 dark:text-gray-dark-50 body-medium-medium placeholder:body-medium-regular placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-400 focus:outline-none dark:bg-gray-dark-950 ${
              cornersPatterns[corners]
            } ${
              finalState === 'hover'
                ? hoverShadowClasses[feedbackType]
                : finalState === 'focused'
                ? focusShadowClasses[feedbackType]
                : finalState === 'active' || finalState === 'filled'
                ? activeShadowClasses[feedbackType]
                : finalState === 'disabled'
                ? disabledShadowClasses[feedbackType]
                : ''
            }`}
            autoComplete="off"
            type="text"
          />
        </div>
        {isDropdownVisible && (
          <div
            className="shadow-large border border-gray-light-200 dark:border-gray-dark-700 rounded-md overflow-auto max-h-80 absolute z-10 w-full bg-white dark:bg-gray-dark-950 mt-1 scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-96 scrollbar-w-2"
            onClick={(event) => event.stopPropagation()}
            ref={dropdownRef}
          >
            <ul className="m-2 space-y-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.id || index} // Assuming each option has a unique id; if not, fallback to index
                    ref={(el) => (itemRefs.current[index] = el)}
                    onMouseDown={(event) => {
                      // Using onMouseDown to preempt onBlur
                      event.preventDefault(); // Prevent the input from losing focus
                      handleSelect(option); // Perform selection
                    }}
                    className={classNames(
                      'hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 dark:text-gray-dark-300 p-2 flex justify-between rounded-md cursor-pointer items-center transition-all duration-100',
                      {
                        'bg-gray-light-50 dark:bg-gray-dark-900':
                          index === highlightedIndex,
                      }
                    )}
                  >
                    <div className="flex gap-2 items-center">
                      {renderLogoOrIcon(option.organizationBranding)}
                      {option.name}
                    </div>
                    {index === highlightedIndex && (
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
    </div>
  );
}
