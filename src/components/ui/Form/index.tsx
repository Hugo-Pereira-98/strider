import { ComponentPropsWithoutRef, KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';

interface FormProps extends ComponentPropsWithoutRef<'form'> {
	onSubmit(): void;
}

export function Form({ className, children, ...props }: FormProps) {
	const { handleSubmit } = useForm();

	const handleSubmitOnEnterPress = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSubmit(props.onSubmit)();
		}
	};

	return (
		<form className={className} onKeyDown={handleSubmitOnEnterPress} {...props}>
			{children}
		</form>
	);
}
