import React, { ComponentPropsWithoutRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { GiPlainCircle } from 'react-icons/gi';

interface RadioButtonProps extends ComponentPropsWithoutRef<'input'> {
	name: string;
	value: string;
}

const RadioButton = ({ name, value, ...props }: RadioButtonProps) => {
	const { register } = useFormContext();

	return (
		<div className="flex items-end">
			<input
				type="radio"
				className="opacity-0 absolute h-4 w-4 [&:checked+div]:bg-primary-600 [&:checked+div>svg]:block z-20"
				{...register(name)}
				value={value}
				{...props}
	/>
			<div className="p-[8px] rounded-full shadow-medium focus:shadow-focus-primary h-4 w-4 transition duration-150 ease-in-out flex-shrink-0 relative">
				<GiPlainCircle className="hidden h-[6px] w-[6px] text-white pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-2" />
			</div>
		</div>
	);
};

export default RadioButton;
