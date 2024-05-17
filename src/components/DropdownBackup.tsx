import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { DotsVertical } from './Icons/DotsVertical'; // Adjust the import path as necessary

interface DropdownProps {
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  hideTriggerButton?: boolean;
}

export const Dropdown = ({
  children,
  isOpen: externalIsOpen,
  onToggle,
  hideTriggerButton = false,
}: DropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});

  // Adjust position when isOpen changes, or when the component mounts, if not hiding trigger button
  useEffect(() => {
    if (!hideTriggerButton && triggerRef.current) {
      adjustDropdownPosition(triggerRef.current);
    }
  }, [isOpen, hideTriggerButton]);

  const adjustDropdownPosition = (triggerElement: HTMLElement) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rect = triggerElement.getBoundingClientRect();
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;

    const styles: React.CSSProperties = {
      position: 'absolute',
    };

    if (spaceBelow > rect.height || spaceBelow > spaceAbove) {
      styles.top = '100%';
      styles.bottom = 'auto';
    } else {
      styles.bottom = '100%';
      styles.top = 'auto';
    }

    if (spaceRight > rect.width || spaceRight > spaceLeft) {
      styles.left = '0';
      styles.right = 'auto';
    } else {
      styles.right = '0';
      styles.left = 'auto';
    }

    setDropdownStyles(styles);
  };

  const handleToggle = () => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(!internalIsOpen);
    }
    onToggle?.();
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={handleToggle}>
      {!hideTriggerButton && (
        <DropdownMenu.Trigger asChild>
          <button
            ref={triggerRef}
            className="outline-none"
            onClick={handleToggle}
          >
            <DotsVertical />
          </button>
        </DropdownMenu.Trigger>
      )}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          style={dropdownStyles}
          className="w-56 rounded-md shadow-lg dark:border dark:border-gray-dark-800 bg-white dark:bg-gray-dark-950 mr-16"
        >
          {children}
          <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
