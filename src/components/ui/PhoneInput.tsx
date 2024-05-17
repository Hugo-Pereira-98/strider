import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { countryCodes } from '../../utils/countryCodes';

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

export interface PhoneInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  feedback?: string;
  feedbackType?: FeedbackTypes;
  state?: StateTypes;
  corners?: CornerTypes;
  labelText?: string;
  margin?: string;
}

const PhoneInputField = React.forwardRef<
  HTMLInputElement,
  PhoneInputFieldProps
>(
  (
    {
      feedback = '',
      feedbackType = 'none',
      state = 'active',
      corners = 'smooth',
      labelText,
      placeholder,
      disabled,
      margin,
      ...props
    },
    ref
  ) => {
    const usIndex = countryCodes.findIndex(
      (country) => country.isoCode === 'US'
    );
    const [selectedCountry, setSelectedCountry] = useState(
      countryCodes[usIndex]
    );
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [displayValue, setDisplayValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      let lastTypeTime = Date.now();
      let typedLetters = '';

      const handleGlobalKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        const now = Date.now();

        if (key === 'Escape') {
          // Check if the pressed key is ESC
          setIsOpen(false); // Close the dropdown
          return; // Exit the function early
        }

        if (now - lastTypeTime > 1000) {
          typedLetters = '';
        }
        lastTypeTime = now;

        if (key.length === 1 && /[a-zA-Z0-9- ]/.test(key)) {
          typedLetters += key.toLowerCase();

          const newIndex = countryCodes.findIndex((country) =>
            country.countryName.toLowerCase().startsWith(typedLetters)
          );

          if (newIndex >= 0) {
            setHighlightedIndex(newIndex);

            const listElement = listRef.current;
            const highlightedElement = listElement?.children[
              newIndex
            ] as HTMLElement;
            highlightedElement?.scrollIntoView({ block: 'nearest' });
          }
        }
      };

      if (isOpen) {
        window.addEventListener('keydown', handleGlobalKeyDown);
      }

      return () => {
        window.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }, [isOpen]);

    const handleCountryChange = (country: (typeof countryCodes)[number]) => {
      setSelectedCountry(country);
      setIsOpen(false);
      setSearchTerm('');
      setInputValue('');
      setDisplayValue('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      let numericValue = rawValue.replace(/\D/g, ''); // Keep only numbers

      let formattedValue = '';
      let valueIndex = 0;

      // Format the display value based on the placeholder
      for (
        let i = 0;
        i < selectedCountry.placeholder.length &&
        valueIndex < numericValue.length;
        i++
      ) {
        if (/\d/.test(selectedCountry.placeholder[i])) {
          formattedValue += numericValue[valueIndex++];
        } else {
          formattedValue += selectedCountry.placeholder[i];
        }
      }

      setDisplayValue(formattedValue);
      setInputValue(numericValue);

      // Log the final value in the desired format: +<CountryCode><NumericValue>
      const finalValue = `+${selectedCountry.countryCode}${numericValue}`;
    };

    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && listRef.current) {
        const listElement = listRef.current;
        const highlightedElement = listElement.children[
          highlightedIndex
        ] as HTMLElement;
        highlightedElement?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, isOpen]);

    const handleArrowNavigation = (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      const filteredCountries = countryCodes.filter((country) =>
        country.countryName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(
          (prevIndex) => (prevIndex + 1) % filteredCountries.length
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(
          (prevIndex) =>
            (prevIndex - 1 + filteredCountries.length) %
            filteredCountries.length
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleCountryChange(filteredCountries[highlightedIndex]);
      }
    };

    return (
      <div
        className={`w-full ${margin} relative`}
        ref={containerRef}
        onKeyDown={handleArrowNavigation}
      >
        {labelText && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {labelText}
          </label>
        )}

        <div
          className={`flex items-center border ${
            corners === 'smooth' ? 'rounded-md' : ''
          } ${disabled ? 'bg-gray-100' : 'bg-white'} shadow-sm`}
        >
          <button
            type="button"
            className="flex items-center justify-between px-3 py-2 text-left bg-white focus:outline-none focus:ring-0 focus:border-transparent rounded-l-md"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            style={{ width: '70px' }}
          >
            {selectedCountry.isoCode}
            <HiOutlineChevronDown
              className={`ml-2 transform transition-transform ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
          {isOpen && (
            <ul
              className="absolute z-10 mt-1 bg-white shadow-lg max-h-60 rounded-md overflow-auto top-full left-0"
              style={{ width: '300px' }}
              ref={listRef}
            >
              {countryCodes
                .filter((country) =>
                  country.countryName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((country, index) => (
                  <li
                    key={country.isoCode}
                    className={`py-2 px-3 hover:bg-gray-100 cursor-pointer ${
                      index === highlightedIndex ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleCountryChange(country)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {country.countryName}
                  </li>
                ))}
            </ul>
          )}
          <input
            ref={ref}
            type="text"
            className="flex-1 p-2 bg-transparent focus:outline-none"
            value={displayValue}
            placeholder={selectedCountry.placeholder}
            disabled={disabled}
            {...props}
            onChange={handleInputChange}
          />
        </div>

        {feedback && (
          <p
            className={`mt-2 text-sm ${
              feedbackType === 'error' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    );
  }
);

PhoneInputField.displayName = 'PhoneInputField';

export default PhoneInputField;
