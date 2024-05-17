import { ComponentPropsWithoutRef } from 'react';
import PaginationItem from './PaginationItem';

interface PaginationProps extends ComponentPropsWithoutRef<'div'> {
	totalItems: number;
	perPage: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const siblingsCount = 1;

const generatePagesArray = (from: number, to: number) => {
	return [...new Array(to - from)]
		.map((_, index) => {
			return from + index + 1;
		})
		.filter((page) => page > 0);
};

export default function Pagination({
	totalItems,
	perPage = 10,
	currentPage = 1,
	className,
	onPageChange,
}: PaginationProps) {
	const lastPage = Math.ceil(totalItems / perPage);

	const previousPages =
		currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) : [];

	const nextPages =
		currentPage < lastPage
			? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount))
			: [];

	return (
		<div className={className}>
			<div className="flex items-center gap-2">
				{currentPage > 1 + siblingsCount && (
					<>
						<PaginationItem onPageChange={onPageChange} number={1} />
						{currentPage > 2 + siblingsCount && <span className="dark:text-gray-dark-400">...</span>}
					</>
				)}

				{previousPages.length > 0 &&
					previousPages.map((page) => {
						return <PaginationItem onPageChange={onPageChange} key={page} number={page} />;
					})}

				<PaginationItem onPageChange={onPageChange} number={currentPage} isCurrent />

				{nextPages.length > 0 &&
					nextPages.map((page) => {
						return <PaginationItem onPageChange={onPageChange} key={page} number={page} />;
					})}

				{currentPage + siblingsCount < lastPage && (
					<>
						{currentPage + 1 + siblingsCount < lastPage && (
							<span className="dark:text-gray-dark-400">...</span>
						)}
						<PaginationItem onPageChange={onPageChange} number={lastPage} />
					</>
				)}
			</div>
		</div>
	);
}
