import { ButtonHTMLAttributes, MouseEvent, useEffect, useState } from 'react';
import { Spinner } from './Spinner';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	icon: React.ReactNode;
	disabled?: boolean;
	size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	corners?: 'smooth' | 'sharp' | 'pill';
	state?: 'active' | 'hover' | 'focused' | 'disabled';
	buttonIconType?: 'light' | 'dark' | 'primary';
}

export default function IconButton({
	loading = false,
	icon,
	disabled = false,
	size = 'sm',
	corners = 'smooth',
	state = 'active',
	buttonIconType = 'light',
	...rest
}: IconButtonProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const handleMouseDown = () => {
		setIsFocused(true);
	};

	const handleMouseUp = () => {
		setIsFocused(false);
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	let finalState = state;
	if (disabled) {
		finalState = 'disabled';
	} else if (isFocused) {
		finalState = 'focused';
	} else if (isHovered) {
		finalState = 'hover';
	}

	const buttonBoxShadow = {
		active: {
			light: 'shadow-medium',
			dark: 'shadow-medium',
			primary: 'shadow-medium',
		},
		hover: {
			light: 'shadow-hover-secondary',
			dark: 'shadow-hover-secondary',
			primary: 'shadow-hover-secondary',
		},
		focused: {
			light: 'shadow-focus-secondary',
			dark: 'shadow-focus-secondary',
			primary: 'shadow-focus-secondary',
		},
		disabled: {
			light: 'shadow-medium',
			dark: 'shadow-medium',
			primary: 'shadow-medium',
		},
	};

	const sizeClasses = {
		'2xs': 'w-8 h-8',
		xs: 'w-10 h-10',
		sm: 'w-12 h-12',
		md: 'w-14 h-14',
		lg: 'w-16 h-16',
		xl: 'w-20 h-18',
		'2xl': 'w-20 h-20',
	};

	const iconSizeClasses = {
		'2xs': 'text-[28px]',
		xs: 'text-[36px]',
		sm: 'text-[44px]',
		md: 'text-[52px]',
		lg: 'text-[60px]',
		xl: 'text-[68px]',
		'2xl': 'text-[76px]',
	};

	const borderRadiusClasses = {
		smooth: 'rounded-md',
		sharp: 'rounded-none',
		pill: 'rounded-full',
	};

	const colorClasses = {
		light: disabled
			? 'bg-white text-gray-300'
			: 'bg-white dark:bg-gray-dark-950 text-neutral-900 dark:text-gray-dark-400 hover:bg-gray-100 hover:bg-gray-dark-900',
		dark: disabled
			? 'bg-gray-100 text-gray-300'
			: 'bg-neutral-900 text-white hover:bg-gray-1000',
		primary: disabled
			? 'bg-gray-100 text-gray-300'
			: 'bg-primary-600 text-white hover:bg-primary-70',
	};

	return (
		<button
			type={rest.type ?? 'button'}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={`
        ${sizeClasses[size]} 
        ${borderRadiusClasses[corners]} 
        ${colorClasses[buttonIconType]} 
        flex items-center justify-center
        transition-all duration-200 ease-in-out outline-none
        ${buttonBoxShadow[finalState][buttonIconType]} 
        ${finalState === 'disabled' ? 'cursor-not-allowed pointer-events-none' : ''}
      `}
			{...rest}
		>
			{loading ? <Spinner color="black" /> : <span className={iconSizeClasses[size]}>{icon}</span>}
		</button>
	);
}
