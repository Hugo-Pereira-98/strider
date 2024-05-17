import React from 'react';

interface ToggleButtonProps {
	activeValue: string;
	inactiveValue: string;
	checked: boolean | null | undefined;
	onChange: (value: any) => void;
}

export default function ToggleButton({
	activeValue,
	inactiveValue,
	checked,
	onChange,
}: ToggleButtonProps) {
	const handleButtonClick = (value: string) => {
		onChange(value);
	};

	const determineButtonActive = (value: string): boolean => {
		if (checked === null) {
			return false;
		} else {
			return value === activeValue ? !!checked : !checked;
		}
	};

	const isNullable = checked === null;

	return (
		<div className="inline-flex bg-gray-200 p-0 items-center border border-gray-300 rounded-md overflow-hidden w-min">
			<button
				className={`${
					determineButtonActive(activeValue)
						? 'bg-primary-600 text-white'
						: 'bg-white text-gray-500'
				} ${isNullable && 'bg-white text-gray-500'} focus:outline-none px-10 py-2`}
				onClick={() => handleButtonClick(activeValue)}
			>
				{activeValue.charAt(0).toUpperCase() + activeValue.slice(1)}
			</button>
			<button
				className={`${
					determineButtonActive(inactiveValue)
						? 'bg-primary-600 text-white'
						: 'bg-white text-gray-500'
				} ${isNullable && 'bg-white text-gray-500'} focus:outline-none px-10 py-2`}
				onClick={() => handleButtonClick(inactiveValue)}
			>
				{inactiveValue.charAt(0).toUpperCase() + inactiveValue.slice(1)}
			</button>
		</div>
	);
}
