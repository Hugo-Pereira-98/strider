import { ComponentPropsWithoutRef } from 'react';

interface CloseProps extends ComponentPropsWithoutRef<'path'> {
	width?: number | string;
	height?: number | string;
}

export function Close({ width, height, ...props }: CloseProps) {
	return (
		<svg
			width={width || 12}
			height={height || 12}
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M11 1L1 11M1 1L11 11"
				strokeWidth="1.66667"
				strokeLinecap="round"
				strokeLinejoin="round"
				{...props}
			/>
		</svg>
	);
}
