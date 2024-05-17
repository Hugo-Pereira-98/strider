import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import CheckBox from './ui/Form/CheckBox';
import { ReactElement } from 'react';

interface SvgProps {
	[x: string]: any;
}

interface ButtonBoxProps {
	name: string;
	icon(props: SvgProps): ReactElement;
	title: string;
	subtitle?: string;
}

export function ButtonBox({ name, icon: Icon, title, subtitle }: ButtonBoxProps) {
	const { setValue, watch } = useFormContext();
	const isChecked = watch(name);

	const handleButtonClick = () => {
		setValue(name, isChecked ? false : true);
	};

	return (
		<button
			type="button"
			className={classNames(
				isChecked ? 'border-primary-600 dark:border-primary-500' : 'border-gray-light-200 dark:border-gray-dark-800',
				{ 'items-center': !subtitle },
				'focus:outline-none p-4 body-small-medium w-full flex gap-1 rounded-xl border-2 bg-white dark:bg-gray-dark-950',
			)}
			onClick={handleButtonClick}
		>
			<div className={classNames({ 'items-center': !subtitle }, 'flex gap-3 flex-1')}>
				<div>
					<div className="bg-primary-100 dark:bg-primary-600 rounded-full h-8 w-8 flex items-center justify-center mt-[2px]">
						{<Icon className="stroke-primary-600 dark:stroke-white" />}
					</div>
				</div>

				<div className="text-left">
					<p className="body-small-medium text-gray-light-700 dark:text-gray-dark-300">{title}</p>
					{subtitle && <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 max-w-sm">{subtitle}</p>}
				</div>
			</div>

			<CheckBox name={name} checked={isChecked} />
		</button>
	);
}
