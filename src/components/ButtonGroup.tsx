interface ButtonGroupProps {
	name?: string;
	label?: string;
	firstOption: string;
	secondOption?: string;
	selectedValue: string;
	onSelect: (selectedOption: string) => void;
	setValue?: any;
}

export function ButtonGroup({
	name,
	label,
	firstOption,
	secondOption,
	selectedValue,
	onSelect,
	setValue,
}: ButtonGroupProps) {
	const handleSelectedValue = (selectedValue: string) => {
		onSelect(selectedValue);
	};

	return (
		<div>
			<div className="flex bg-gray-light-50 dark:bg-gray-dark-950 p-1 items-center border border-gray-light-200 dark:border-gray-dark-800 rounded-[10px] overflow-hidden w-full gap-1">
				<button
					type="button"
					className={`focus:outline-none p-2 capitalize body-small-semibold rounded-md w-full ${
						selectedValue === firstOption ? 'bg-white dark:bg-gray-dark-900 shadow-small text-gray-light-700 dark:text-gray-dark-300' : 'bg-gray-light-50 dark:bg-gray-dark-950 text-gray-light-500 dark:text-gray-dark-400'
					}`}
					onClick={() => {
						handleSelectedValue(firstOption);
						setValue && setValue(name, firstOption);
					}}
				>
					{firstOption}
				</button>

				{secondOption && (
					<button
						type="button"
						className={`focus:outline-none p-2 capitalize body-small-semibold rounded-md w-full ${
							selectedValue === secondOption ? 'bg-white dark:bg-gray-dark-900 shadow-small text-gray-light-700 dark:text-gray-dark-300' : 'bg-gray-light-50 dark:bg-gray-dark-950 text-gray-light-500 dark:text-gray-dark-400'
						}`}
						onClick={() => {
							handleSelectedValue(secondOption);
							setValue && setValue(name, secondOption);
						}}
					>
						{secondOption}
					</button>
				)}
			</div>
		</div>
	);
}
