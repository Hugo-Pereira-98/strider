import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotsVertical } from './Icons/DotsVertical';
import { ReactNode, useState } from 'react';

interface DropdownProps {
  children: ReactNode;
}

export const Dropdown = ({ children }: DropdownProps) => {
  const [dropdownStyles, setDropdownStyles] = useState({});

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

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="outline-none"
          onClick={(e) => adjustDropdownPosition(e.currentTarget)}
        >
          <DotsVertical />
        </button>
      </DropdownMenu.Trigger>

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
