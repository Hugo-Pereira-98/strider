import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DropDownOption {
	title: string;
	supportText?: string;
	leftContent?: React.ReactNode;
	rightContent?: React.ReactNode;
}

interface DropDownProps {
	options: DropDownOption[];
	onSelect: (value: string) => void;
	disabled?: boolean;
	width?: string;
	labelText?: string;
	placeholder?: string;
	initialValue?: string;
}

export const DropDown = React.forwardRef<HTMLInputElement, DropDownProps>(
	(
		{
			options,
			onSelect,
			disabled = false,
			width = 'w-full',
			labelText,
			placeholder,
			initialValue,
			...props
		},
		ref,
	) => {
		const [selectedOption, setSelectedOption] = useState<DropDownOption | null>(null);
		const [isDropdownVisible, setDropdownVisible] = useState(false);
		const [searchTerm, setSearchTerm] = useState('');
		const dropdownRef = useRef<HTMLDivElement | null>(null);

		const handleSelect = useCallback(
			(option: DropDownOption) => {
				onSelect(option.title);
				setSelectedOption(option);
				setDropdownVisible(false);
			},
			[onSelect],
		);

		useEffect(() => {
			function handleClickOutside(event: MouseEvent) {
				if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
					setDropdownVisible(false);
				}
			}

			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, []);

		useEffect(() => {
			function handleKeydown(event: KeyboardEvent) {
				if (isDropdownVisible) {
					if (event.key === 'Enter' && selectedOption) {
						event.preventDefault();
						handleSelect(selectedOption);
						return;
					}

					const character = String.fromCharCode(event.keyCode);
					setSearchTerm((prevTerm) => prevTerm + character);
					const matchingOption = options.find((option) => option.title.startsWith(searchTerm));
					if (matchingOption) {
						setSelectedOption(matchingOption);
					}
					setTimeout(() => {
						setSearchTerm('');
					}, 1000);
				}
			}

			document.addEventListener('keydown', handleKeydown);
			return () => {
				document.removeEventListener('keydown', handleKeydown);
			};
		}, [isDropdownVisible, options, searchTerm, selectedOption, handleSelect]);

		useEffect(() => {
			if (initialValue) {
				const initialOption = options.find((option) => option.title === initialValue);
				if (initialOption) {
					setSelectedOption(initialOption);
				}
			}
		}, [initialValue, options]);

		return (
			<div>
				{labelText && (
					<label className="block body-small-medium text-neutral-600 mb-1">{labelText}</label>
				)}
				<div
					className={`relative ${width} ${disabled ? 'cursor-not-allowed' : ''}`}
					ref={dropdownRef}
				>
					<div className="flex flex-col">
						<input
							ref={ref}
							value={selectedOption?.title || ''}
							onClick={() => setDropdownVisible(!isDropdownVisible)}
							disabled={disabled}
							placeholder={placeholder}
							className="shadow-medium focus:shadow-focus-primary rounded-md p-2 outline-none body-medium-regular placeholder:body-medium-regular placeholder:text-gray-400 bg-white"
							readOnly
							{...props}
						/>
					</div>
					{isDropdownVisible && (
						<div className="shadow-medium rounded-md mt-1 overflow-auto max-h-60 absolute z-10 w-full bg-white">
							{options.map((option, index) => (
								<div
									ref={ref}
									key={index}
									onClick={() => handleSelect(option)}
									className="flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-white transition-all duration-100"
								>
									{option.leftContent && <div className="mr-2">{option.leftContent}</div>}
									<div className="flex-grow flex items-center gap-2">
										<div className="body-medium-medium text-gray-800">{option.title}</div>
										{option.supportText && (
											<div className="body-medium-medium text-gray-500">{option.supportText}</div>
										)}
									</div>
									{option.rightContent && <div className="ml-2">{option.rightContent}</div>}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		);
	},
);

DropDown.displayName = 'DropDown';

export default DropDown;
