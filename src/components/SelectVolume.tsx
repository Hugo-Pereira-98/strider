import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi2';

interface Option {
	label: string;
	value: any;
}

interface SelectVolumeProps {
	defaultValue: Option;
	options: Option[];
	onChange: (option: Option) => void;
}

export function SelectVolume({ defaultValue, options, onChange }: SelectVolumeProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<Option>(defaultValue);

	const handleOptionClick = useCallback(
		(option: Option) => {
			setSelectedOption(option);
			setIsOpen(false);
			onChange(option);
		},
		[onChange],
	);

	const containerRef = useRef<HTMLDivElement | null>(null);

	const handleClickOutside = (event: any) => {
		if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyPress as any);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyPress as any);
		};
	}, []);

	useEffect(() => {
		handleOptionClick(defaultValue);
	}, [defaultValue, handleOptionClick]);

	return (
		<div className="relative" ref={containerRef}>
			<div
				className="flex items-center gap-2 p-2 bg-white rounded-r-md border-l cursor-pointer capitalize"
				onClick={() => setIsOpen(!isOpen)}
			>
				{selectedOption.label}
				<HiOutlineChevronDown className="stroke-2" />
			</div>
			{isOpen && (
				<div className="absolute mt-2 w-full border border-gray-300 bg-white rounded shadow z-20">
					{options.map((option, index) => (
						<div
							key={index}
							className="p-2 cursor-pointer hover:bg-gray-100"
							onClick={() => handleOptionClick(option)}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
