import classNames from 'classnames';
import { IconType } from 'react-icons';

interface SideItemProps {
	title: string;
	description: string;
	border?: boolean;
	isCurrentItem: boolean;
	icon: IconType;
}

export default function SideItem({
	title,
	description,
	border = true,
	isCurrentItem,
	icon: Icon,
}: SideItemProps) {
	return (
		<>
			<div className="flex gap-4">
				<div
					className={classNames(
						{ 'border-opacity-40': !isCurrentItem },
						'w-12 h-12 flex items-center justify-center relative rounded-xl border border-gray-light-300 dark:border-gray-dark-700 shadow-extra-small',
					)}
				>
					<Icon
						className={classNames(
							isCurrentItem ? 'stroke-gray-light-700 dark:stroke-gray-dark-300' : 'stroke-gray-light-700/40 dark:stroke-gray-dark-300/40',
						)}
					/>
				</div>
				<div>
					<p
						className={classNames(
							{ 'text-opacity-40 dark:text-opacity-40': !isCurrentItem },
							'body-medium-semibold text-gray-light-700 dark:text-gray-dark-300',
						)}
					>
						{title}
					</p>
					<p
						className={classNames(
							{ 'text-opacity-40 dark:text-opacity-40': !isCurrentItem },
							'body-medium-regular text-gray-light-600 dark:text-gray-dark-400',
						)}
					>
						{description}
					</p>
				</div>
			</div>

			{border && (
				<div
					className={classNames(
						{ 'bg-opacity-40 dark:bg-opacity-40': !isCurrentItem },
						'w-[2px] h-7 ml-6 my-1 rounded-full bg-gray-light-300 dark:bg-gray-dark-700',
					)}
				/>
			)}
		</>
	);
}
