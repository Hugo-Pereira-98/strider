import { ComponentPropsWithoutRef } from 'react';

interface BuildingProps extends ComponentPropsWithoutRef<'path'> {
	width?: number | string;
	height?: number | string;
}

export function Building({ width, height, ...props }: BuildingProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width || 24}
			height={height || 24}
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M7.5 11H4.6c-.56 0-.84 0-1.054.109a1 1 0 00-.437.437C3 11.76 3 12.04 3 12.6V21m13.5-10h2.9c.56 0 .84 0 1.054.109a1 1 0 01.437.437C21 11.76 21 12.04 21 12.6V21m-4.5 0V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C14.98 3 14.42 3 13.3 3h-2.6c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C7.5 4.52 7.5 5.08 7.5 6.2V21M22 21H2m9-14h2m-2 4h2m-2 4h2"
				{...props}
			/>
		</svg>
	);
}
