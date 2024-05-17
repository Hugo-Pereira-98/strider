import { ReactNode } from 'react';

interface FeaturedIconProps {
	className?: string;
	children: ReactNode;
}

export function FeaturedIcon({ className = '', children }: FeaturedIconProps) {
	return (
		<div
			className={`
				w-14 h-14 flex items-center justify-center relative rounded-xl bg-white dark:bg-gray-dark-950 border border-gray-light-200 dark:border-gray-dark-700 shadow-extra-small cursor-default ${className}
			`}
		>
			{children}
		</div>
	);
}
