import React, { useRef } from 'react';

const toggleSizes = {
	sm: 'w-[36px] h-5',
	md: 'w-11 h-6',
	lg: 'w-14 h-7',
};

const toggleButtonSizes = {
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
};

interface ToggleProps {
	value: boolean;
	onChange: (value: boolean) => void;
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
}

export default function Toggle({ value, size = 'md', disabled = false, onChange }: ToggleProps) {
	const ref = useRef<HTMLDivElement>(null);
	const handleClick = () => {
		if (!disabled) {
			onChange(!value);
			if (ref.current) {
				ref.current.focus();
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
			handleClick();
		}
	};

	const toggleSize = toggleSizes[size];
	const toggleButtonSize = toggleButtonSizes[size];

	return (
		<div
			className={`relative cursor-pointer rounded-full ${toggleSize} transition-colors duration-200 ease-in-out 
      ${
				value && !disabled
					? 'bg-primary-600 focus:shadow-focus-primary'
					: !disabled
					? 'bg-gray-light-100 dark:bg-gray-dark-800 focus:shadow-focus-secondary'
					: 'bg-gray-light-100 dark:bg-gray-dark-800'
			}
      ${disabled ? 'cursor-not-allowed' : ''}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex={disabled ? -1 : 0}
			ref={ref}
		>
			<div
				className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-200 ease-in-out rounded-full 
        ${'bg-white shadow-small'} 
        ${toggleButtonSize} 
        ${value ? 'right-[2px]' : 'left-[2px]'}
				${disabled ? 'opacity-40' : ''}`}
			/>
		</div>
	);
}
