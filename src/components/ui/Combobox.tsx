import React, { useState, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';

interface ComboboxOption {
  title: string;
  supportText?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

interface ComboboxProps {
  options: ComboboxOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  width?: string;
  labelText?: string;
  placeholder?: string;
}

export default function Combobox({
  options,
  onSelect,
  disabled = false,
  width = 'w-full',
  labelText,
  placeholder,
}: ComboboxProps) {
  const [selectedOption, setSelectedOption] = useState<ComboboxOption | null>(
    null
  );
  const [inputValue, setInputValue] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isInputFocused, setInputFocused] = useState(false);

  const handleSelect = (option: ComboboxOption) => {
    onSelect(option.title);
    setSelectedOption(option);
    setInputValue(option.title);
    setDropdownVisible(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setDropdownVisible(true);
    setHighlightedIndex(-1);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setDropdownVisible(true);
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setDropdownVisible(true);
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="p-4">
      {labelText && (
        <div className="text-sm text-gray-600 mb-2">{labelText}</div>
      )}
      <div
        className={`relative ${width} ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col">
          <input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            onFocus={() => setDropdownVisible(true)}
            onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
            placeholder={placeholder}
            className="shadow-medium focus:shadow-focus-primary rounded-md p-2 outline-none"
            autoComplete="off"
            type="text"
          />
        </div>
        {isDropdownVisible && (
          <div
            className="shadow-medium rounded-md overflow-auto max-h-60 absolute z-10 w-full bg-white mt-1"
            onClick={(event: MouseEvent) => event.stopPropagation()}
          >
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-white transition-all duration-100 ${
                  index === highlightedIndex ? 'bg-gray-200' : ''
                }`}
              >
                {option.leftContent && (
                  <div className="mr-2">{option.leftContent}</div>
                )}
                <div className="flex-grow flex items-center gap-2 ">
                  <div className="body-medium-medium text-gray-800">
                    {option.title}
                  </div>
                  {option.supportText && (
                    <div className="body-medium-medium text-gray-500">
                      {option.supportText}
                    </div>
                  )}
                </div>
                {option.rightContent && (
                  <div className="ml-2">{option.rightContent}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
