import RadioButton from './ui/Form/RadioButton';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

interface ButtonOptionProps {
	name: string;
	value: string;
	children: React.ReactNode;
}

export function ButtonOption({ name, value, children }: ButtonOptionProps) {
	const { setValue, watch } = useFormContext();
	const isChecked = watch(name) === value;

	const handleButtonClick = () => {
		setValue(name, isChecked ? 'BUY' : value);
	};

	return (
		<button
			type="button"
			className={classNames(
				isChecked ? 'border-primary-600' : 'border-gray-light-200 dark:border-gray-dark-800',
				'focus:outline-none p-4 capitalize body-small-medium w-full flex items-center gap-2 rounded-xl border-2 text-gray-light-700 dark:text-gray-dark-300 bg-white dark:bg-gray-dark-950',
			)}
			onClick={handleButtonClick}
		>
			<RadioButton name={name} value={value} checked={isChecked} />
			{children}
		</button>
	);
}
