import React, { useState } from 'react';
import { Device } from '../Device';
import { Search } from '../Icons/Search';

interface SearchButtonProps {
  isOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  isOpen,
  setSearchModalOpen,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className={`flex items-center ${
        isOpen ? 'px-[14px] py-[8px]' : 'p-2'
      } dark:bg-gray-dark-900 border-gray-light-200 dark:border-gray-dark-800 shadow-extra-small rounded-md border hover:shadow-hover-primary transition-all duration-300 max-h-[36px] mx-3`}
      onClick={() => setSearchModalOpen(true)}
      style={{
        width: isOpen ? 'auto' : '40px',
        height: isOpen ? 'auto' : '40px',
        justifyContent: isOpen ? 'start' : 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Search
        className="stroke-gray-light-500 dark:stroke-gray-dark-400"
        width="18"
        height="18"
      />

      {isHovered && !isOpen && (
        <div className="flex items-center absolute right-[-102px] rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-900 transition-all duration-150 ease-in-out h-10 px-2 border border-gray-light-200 dark:border-gray-dark-800 shadow-[0_0_0_4px_rgba(152,162,179,0.14)]">
          <div className="flex-shrink-0">
            <Search
              className="stroke-purple-500 dark:stroke-purple-300"
              width="24"
              height="24"
            />
          </div>
          <div className="ml-2 mr-6 text-gray-light-700 dark:text-gray-dark-300 outline-none body-small-medium flex items-center">
            Search
          </div>
          <div className="flex-grow"></div>{' '}
          <div className="hidden lg:flex items-center px-1 py-[2px] border border-gray-light-200 dark:border-gray-dark-800 body-small-regular text-gray-light-600 dark:text-gray-dark-400 bg-gray-light-50 dark:bg-gray-dark-950 rounded">
            <Device>
              {({ isMacOs }) => (
                <span className="body-small-regular text-gray-light-700 dark:text-gray-dark-300">
                  {isMacOs ? '⌘' : 'Ctrl'}
                </span>
              )}
            </Device>
            <span className="ml-1 body-small-regular text-gray-light-700 dark:text-gray-dark-300">
              K
            </span>
          </div>
        </div>
      )}

      {isOpen && (
        <>
          <div className="text-gray-light-700 dark:text-gray-dark-300 outline-none body-small-medium w-full text-left ml-2">
            Search
          </div>
          <div className="hidden px-1 py-[2px] rounded lg:flex items-center border border-gray-light-200 dark:border-gray-dark-800 body-small-regular text-gray-light-600 dark:text-gray-dark-400 bg-gray-light-50 dark:bg-gray-dark-950">
            <Device>
              {({ isMacOs }) =>
                isMacOs ? (
                  <span className="body-small-regular text-gray-light-700 dark:text-gray-dark-300">
                    ⌘
                  </span>
                ) : (
                  <span className="block mr-1 body-small-regular text-gray-light-700 dark:text-gray-dark-300">
                    Ctrl
                  </span>
                )
              }
            </Device>
            <span className="body-small-regular text-gray-light-700 dark:text-gray-dark-300">
              K
            </span>
          </div>
        </>
      )}
    </button>
  );
};

export default SearchButton;
