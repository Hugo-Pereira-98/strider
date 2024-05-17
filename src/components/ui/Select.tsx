import classNames from 'classnames';
import { ComponentPropsWithRef, forwardRef, useEffect, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

export type CornerTypes = 'smooth' | 'sharp' | 'pill' | 'rounded';

interface SelectProps extends ComponentPropsWithRef<'button'> {
	name: string;
	control?: Control<any>;
	labelText?: string;
	options: {
		value: string | number;
		label: string | number;
		leftContent?: any;
	}[];
	width?: string;
	corner?: CornerTypes;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
	({ control, name, labelText, options, width = 'w-full', corner = 'rounded', ...props }, ref) => {
		const [isOpen, setIsOpen] = useState(false);

		const trailIconCornersPatterns = {
			sharp: 'rounded-r-none',
			smooth: 'rounded',
			rounded: 'rounded-r-lg',
			pill: 'rounded-r-full',
		};

		const containerRef = useRef<HTMLInputElement | null>(null);

		const handleClickOutside = (event: any) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
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
			document.addEventListener('keydown', handleKeyPress);

			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
				document.removeEventListener('keydown', handleKeyPress);
			};
		}, []);

		return (
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => (
					<div className="relative" ref={containerRef}>
						{labelText && (
							<label className="block body-small-medium text-neutral-600 mb-1">{labelText}</label>
						)}
						<div className="relative bg-transparent">
							<button
								type="button"
								onClick={() => setIsOpen(!isOpen)}
								className={classNames(
									width,
									trailIconCornersPatterns[corner],
									'shadow-medium rounded-r-md focus:shadow-focus-primary p-2 body-medium-regular placeholder:body-medium-regular placeholder:text-gray-400 bg-white',
								)}
								ref={ref}
							>
								<span className="flex items-center">
									<span className="mr-6 block truncate">{value || 'Choose'}</span>
								</span>
								<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										className={`h-5 w-5 ${
											isOpen ? 'text-neutral-600' : 'text-neutral-400'
										} transition-transform`}
										aria-hidden="true"
										style={{
											transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
										}}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</span>
							</button>

							{isOpen && (
								<div className="absolute z-10 mt-2 w-32 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm rounded-md overflow-y-auto h-32">
									{options.map((option) => (
										<button
											key={option.value}
											type="button"
											onClick={() => {
												onChange(option.label);
												setIsOpen(false);
											}}
											className={`relative cursor-pointer select-none p-2 w-full text-left ${
												value === option.label
													? 'bg-neutral-200'
													: 'text-neutral-900 hover:bg-gray-100'
											}`}
											{...props}
										>
											<div className="flex items-center">
												{option.leftContent && option.leftContent}
												<span
													className={`ml-3 block truncate ${
														value === option.label ? 'font-semibold' : 'font-normal'
													}`}
												>
													{option.label}
												</span>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			/>
		);
	},
);

Select.displayName = 'Select';

export default Select;
