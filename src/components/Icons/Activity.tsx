export function Activity({ ...props }) {
	return (
		<svg
			width={props.width || 24}
			height={props.height || 24}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M22 12H18L15 21L9 3L6 12H2"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				{...props}
			/>
		</svg>
	);
}
