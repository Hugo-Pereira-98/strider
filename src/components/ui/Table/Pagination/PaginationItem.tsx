interface PaginationItemProps {
	number: number;
	isCurrent?: boolean;
	onPageChange: (page: number) => void;
}

export default function PaginationItem({
	number,
	isCurrent = false,
	onPageChange,
}: PaginationItemProps) {
	if (isCurrent) {
		return (
			<button
				className="body-small-medium bg-gray-light-50 dark:bg-gray-dark-800 w-10 h-10 rounded-md text-gray-light-800 dark:text-gray-dark-200"
				type="button"
				disabled
			>
				{number}
			</button>
		);
	}

	return (
		<button
			type="button"
			className="body-small-medium w-10 h-10 rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 text-gray-light-600 dark:text-gray-dark-400"
			onClick={() => onPageChange(number)}
		>
			{number}
		</button>
	);
}
