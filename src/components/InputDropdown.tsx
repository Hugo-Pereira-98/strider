import React, {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import classNames from 'classnames';

export interface OptionType {
  name: string;
  value: string;
  numericalValue: number;
  type: 'money' | 'shares';
  regex?: RegExp;
}

interface InputDropdownProps extends ComponentPropsWithoutRef<'input'> {
  defaultValue: string;
  defaultOption: OptionType | undefined;
  options: OptionType[];
  selectedOption: OptionType;
  error?: boolean;
  icon?: ReactNode;
  trailContent?: {
    type: 'dropdown' | 'text' | 'none';
    text?: string;
  };
  onValueChange?: (value: { inputValue: string; finalValue: number }) => void;
  onSelectedOption: (value: OptionType) => void;
}

export function InputDropdown({
  defaultValue,
  defaultOption,
  options,
  selectedOption,
  error = false,
  trailContent,
  icon,
  onValueChange,
  onSelectedOption,
  ...props
}: InputDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      inputValue &&
      selectedOption.regex &&
      !selectedOption.regex.test(inputValue)
    ) {
      setInputValue('');
    }
  }, [selectedOption, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (
      value === '' ||
      (selectedOption.regex && selectedOption.regex.test(value))
    ) {
      setInputValue(value);
    }
  };

  const getDecimalPrecision = (regex: RegExp) => {
    const match = regex.source.match(/\\d{0,(\d+)}/);
    return match ? parseInt(match[1]) : 0;
  };

  const multipliedValue =
    parseFloat(inputValue) * selectedOption.numericalValue;
  const precision = getDecimalPrecision(selectedOption.regex!);
  const adjustedValue = {
    inputValue: isNaN(parseFloat(inputValue))
      ? (0 as unknown as string)
      : (parseFloat(inputValue) as unknown as string),
    finalValue: isNaN(multipliedValue)
      ? 0
      : +multipliedValue.toFixed(precision),
  };

  const handleClickOutside = (event: any) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    onSelectedOption(defaultOption || options[0]);
  }, [options]);

  useEffect(() => {
    if (!selectedOption) {
      onSelectedOption(defaultOption || options[0]);
    }
  }, [defaultOption, options, selectedOption, onSelectedOption]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress as any);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress as any);
    };
  }, []);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(adjustedValue);
    }
  }, [adjustedValue.finalValue]);

  const handleOptionClick = (option: OptionType) => {
    onSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex items-center rounded-md" ref={containerRef}>
      <span className="pl-[14px]">{icon}</span>

      <input
        value={inputValue}
        onChange={handleInputChange}
        type="text"
        className={classNames(
          error
            ? 'bg-white dark:bg-gray-dark-950'
            : 'bg-white dark:bg-gray-dark-950',
          'rounded-md p-2 text-gray-light-950 dark:text-gray-dark-50 body-medium-regular placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-500 w-full outline-none shadow-extra-small'
        )}
        pattern={selectedOption.regex?.source}
        {...props}
      />

      {trailContent?.type === 'dropdown' ? (
        <div className="relative">
          <div
            className={classNames(
              error
                ? 'bg-white dark:bg-gray-dark-950'
                : 'bg-white dark:bg-gray-dark-950',
              'flex items-center justify-between pr-2  gap-1 rounded-r-md ml-1 cursor-pointer capitalize min-w-[90px] dark:text-gray-300'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption.name}
            <HiOutlineChevronDown
              className={`stroke-2 transform transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          {isOpen && (
            <div
              className={`absolute mt-2 w-full border dark:border-gray-dark-700 bg-white dark:bg-gray-dark-950 rounded shadow z-20 transition-all duration-300 transform scale-95 origin-top dark:text-gray-300 ${
                isOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-2'
              }`}
            >
              {options.map((option, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-light-50 dark:hover:bg-gray-dark-800"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : trailContent?.type === 'text' ? (
        <p className="hidden sm:block body-medium-regular text-gray-light-700 dark:text-gray-dark-300 w-[110px] text-right pr-[14px] cursor-default">
          {trailContent.text}
        </p>
      ) : (
        trailContent?.type === 'none' && null
      )}
    </div>
  );
}
