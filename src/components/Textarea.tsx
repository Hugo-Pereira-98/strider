import React, { useState, useRef } from 'react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { getUsersFiltered, openDB } from '@/utils/indexedDB';
import { User } from '@/utils/interfaces';

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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  feedback?: string;
  feedbackType?: FeedbackTypes;
  state?: StateTypes;
  corners?: CornerTypes;
  labelText?: string;
  placeholder?: string;
  helpText?: string;
  heightPx?: string;
}

const mockUsers = ['john_doe', 'jane_smith', 'alex_jones'];

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      feedback = '',
      feedbackType = 'none',
      state = 'active',
      corners = 'smooth',
      labelText,
      placeholder,
      disabled,
      helpText,
      heightPx,
      ...props
    },
    ref
  ) => {
    const [isFilled, setIsFilled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [cursor, setCursor] = useState<number>(-1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hiddenDivRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{
      top: number;
      left: number;
    }>({ top: 0, left: 0 });

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

    const handleBlur = () => setIsFocused(false);

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (finalState === 'disabled' || finalState === 'viewOnly') return;

      const value = e.target.value;
      const isInputFilled = value !== '';
      setIsFilled(isInputFilled);
      if (props.onChange) {
        props.onChange(e);
      }

      const cursorPosition = e.target.selectionStart!;
      const textBeforeCursor = value.slice(0, cursorPosition);
      const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

      if (lastAtSymbol !== -1) {
        const tag = textBeforeCursor.slice(lastAtSymbol + 1);
        setCurrentTag(tag);
        if (tag.length >= 0) {
          const suggestions =
            tag.length > 0
              ? mockUsers.filter((user) => user.includes(tag))
              : mockUsers;
          setFilteredUsers(suggestions);
          setShowSuggestions(true);
          const { top, left } = getCursorCoordinates(textBeforeCursor);
          setDropdownPosition({ top, left });
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showSuggestions) {
        if (e.key === 'ArrowDown') {
          setCursor((prevCursor) =>
            prevCursor < filteredUsers.length - 1 ? prevCursor + 1 : prevCursor
          );
          e.preventDefault();
        } else if (e.key === 'ArrowUp') {
          setCursor((prevCursor) =>
            prevCursor > 0 ? prevCursor - 1 : prevCursor
          );
          e.preventDefault();
        } else if (e.key === 'Enter') {
          if (cursor >= 0 && cursor < filteredUsers.length) {
            selectUser(filteredUsers[cursor]);
            e.preventDefault();
          }
        } else if (e.key === 'Escape') {
          setShowSuggestions(false);
          e.preventDefault();
        }
      }
    };

    const selectUser = (user: string) => {
      const textarea = textareaRef.current!;
      const value = textarea.value;
      const cursorPosition = textarea.selectionStart!;
      const textBeforeCursor = value.slice(0, cursorPosition);
      const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
      const textAfterCursor = value.slice(cursorPosition);

      const newValue =
        textBeforeCursor.slice(0, lastAtSymbol + 1) +
        user +
        ' ' +
        textAfterCursor;
      textarea.value = newValue;
      setSelectedTags((prevTags) => [...prevTags, user]);
      setShowSuggestions(false);
      setCurrentTag('');
      setCursor(-1);

      const newCursorPosition = lastAtSymbol + 1 + user.length + 1;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    };

    const getCursorCoordinates = (text: string) => {
      const hiddenDiv = hiddenDivRef.current!;
      hiddenDiv.innerText = text;
      const span = document.createElement('span');
      span.innerText = ' ';
      hiddenDiv.appendChild(span);
      const rect = span.getBoundingClientRect();
      hiddenDiv.removeChild(span);
      const { top, left } = rect;
      const textareaRect = textareaRef.current!.getBoundingClientRect();
      return { top: top - textareaRect.top, left: left - textareaRect.left };
    };

    let finalState = state;
    if (disabled) finalState = 'disabled';
    else if (isFilled) finalState = 'filled';
    else if (isFocused) finalState = 'focused';
    else if (isHovered) finalState = 'hover';

    const cornersPatterns = {
      sharpRight: 'rounded-r-none rounded-md',
      sharpLeft: 'rounded-l-none rounded-md',
      sharp: 'rounded-none',
      smooth: 'rounded-md',
      rounded: 'rounded-md',
      pill: 'rounded-full',
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

    return (
      <div className="w-full relative">
        <div
          ref={hiddenDivRef}
          className="invisible absolute whitespace-pre-wrap p-3"
          style={{ width: '100%', height: 'auto', visibility: 'hidden' }} // Ensure completely invisible
        />
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
            <textarea
              ref={textareaRef}
              placeholder={placeholder}
              disabled={disabled || finalState === 'disabled'}
              readOnly={finalState === 'viewOnly'}
              style={{ height: heightPx }}
              className={`
                relative w-full p-3 bg-white dark:bg-gray-dark-950 text-gray-light-950 dark:text-gray-dark-50 body-medium-regular placeholder:body-medium-regular placeholder:text-gray-light-500 dark:placeholder:text-gray-dark-500 focus:outline-none              
                ${cornersPatterns[corners]} ${
                corners === 'sharpLeft'
                  ? 'border-l-none border-r border-t border-b'
                  : 'border'
              } 
                ${
                  feedbackType === 'error'
                    ? 'border-red-300 dark:border-red-400'
                    : 'border-gray-light-300 dark:border-gray-dark-700'
                }
                ${
                  isFocused
                    ? focusShadowClasses[feedbackType]
                    : isHovered
                    ? hoverShadowClasses[feedbackType]
                    : ''
                }
              `}
              {...props}
              autoFocus={true}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleOnChange}
              onKeyDown={handleKeyDown}
            />
            {showSuggestions && (
              <ul
                className="absolute mt-11 z-[999] bg-white dark:bg-gray-dark-950 border border-gray-light-300 dark:border-gray-dark-700 rounded-md shadow-lg"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                }}
              >
                {filteredUsers.map((user, index) => (
                  <li
                    key={user}
                    className={`p-2 cursor-pointer pr-10 ${
                      index === cursor
                        ? 'bg-gray-light-200 dark:bg-gray-dark-700'
                        : ''
                    }`}
                    onMouseDown={() => selectUser(user)}
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

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

Textarea.displayName = 'Textarea';

export default Textarea;
