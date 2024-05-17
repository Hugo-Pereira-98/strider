import { useState } from 'react';

interface ButtonGroupProps {
	index: number;
	onAnswerChange: (index: number, value: boolean) => void;
}

export function ButtonGroup({ index, onAnswerChange }: ButtonGroupProps) {
	const [answer, setAnswer] = useState<string | undefined>(undefined);

	const handleSelectedValue = (e: React.MouseEvent<HTMLButtonElement>) => {
		const value = e.currentTarget.value === '1';
		setAnswer(value ? '1' : '0');
		onAnswerChange(index, value);
	};

	const isYesOptionSelected = answer === '1';
	const isNoOptionSelected = answer === '0';

	return (
		<div className="inline-flex bg-gray-200 p-0 items-center border border-gray-300 rounded-md overflow-hidden w-min">
			<button
				value="1"
				className={`focus:outline-none px-10 py-2 ${
					isYesOptionSelected ? 'bg-primary-600 text-white' : 'bg-white text-gray-500'
				}`}
				onClick={handleSelectedValue}
			>
				Yes
			</button>
			<button
				value="0"
				className={`focus:outline-none px-10 py-2 ${
					isNoOptionSelected ? 'bg-primary-600 text-white' : 'bg-white text-gray-500'
				}`}
				onClick={handleSelectedValue}
			>
				No
			</button>
		</div>
	);
}
