import { useState, useEffect } from 'react';
import { HiMinusSm, HiOutlineCheck, HiMinus } from 'react-icons/hi';

type Props = {
	checkboxStatus?: boolean;
	boxSize?: 'small' | 'medium' | 'large';
	corners?: 'regular' | 'rounded';
	state?: 'active' | 'hovered' | 'focused' | 'disabled';
	label?: React.ReactNode;
	disabled?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const sizes = {
	small: '18px',
	medium: '22px',
	large: '26px',
};

const cornerTypes = {
	rounded: 'rounded-[50%]',
	regular: 'rounded-[4px]',
};

const CheckBox: React.FC<Props> = ({
	checkboxStatus,
	disabled = false,
	boxSize = 'medium',
	state = 'active',
	label,
	corners = 'regular',
	onChange,
	...rest
}) => {
	const finalState = disabled ? 'disabled' : state;
	const [interactionState, setInteractionState] = useState(finalState);
	const [checkboxState, setCheckboxState] = useState<'checked' | 'indeterminate' | 'unchecked'>(
		() => {
			if (checkboxStatus === undefined) {
				return 'indeterminate';
			}
			return checkboxStatus ? 'checked' : 'unchecked';
		},
	);

	useEffect(() => {
		if (checkboxStatus === undefined) {
			setCheckboxState('indeterminate');
		} else {
			setCheckboxState(checkboxStatus ? 'checked' : 'unchecked');
		}
	}, [checkboxStatus]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (interactionState !== 'disabled' && onChange) {
			onChange(e);
		}
	};

	const baseStyle = `relative flex justify-center items-center transition-all duration-200`;

	return (
		<div
			className="inline-flex items-center justify-center cursor-pointer"
			style={{ height: sizes[boxSize], width: sizes[boxSize] }}
			onMouseEnter={() => interactionState !== 'disabled' && setInteractionState('hovered')}
			onMouseLeave={() => interactionState !== 'disabled' && setInteractionState(finalState)}
			onFocus={() => interactionState !== 'disabled' && setInteractionState('focused')}
			onBlur={() => interactionState !== 'disabled' && setInteractionState(finalState)}
		>
			<label
				className={`relative flex items-center ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
			>
				<input
					type="checkbox"
					style={{ appearance: 'none', outline: 'none' }}
					className={`absolute h-full w-full ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
					checked={checkboxStatus}
					disabled={interactionState === 'disabled'}
					onChange={handleChange}
					{...rest}
				/>

				<div
					className={`${baseStyle} ${
						interactionState === 'disabled'
							? 'bg-gray-200'
							: checkboxState === 'checked'
							? 'bg-primary-600'
							: checkboxState === 'indeterminate'
							? 'bg-primary-600'
							: 'bg-white'
					} ${cornerTypes[corners]}`}
				>
					{checkboxState === 'checked' && (
						<HiOutlineCheck
							className="text-white"
							size={boxSize === 'large' ? '24px' : boxSize === 'medium' ? '20px' : '16px'}
						/>
					)}
					{checkboxState === 'indeterminate' && (
						<HiMinusSm
							className="text-white"
							size={boxSize === 'large' ? '24px' : boxSize === 'medium' ? '20px' : '16px'}
						/>
					)}
					{checkboxState === 'unchecked' && (
						<div
							className={`shadow-medium ${cornerTypes[corners]} ${
								disabled ? 'bg-gray-200' : 'bg-white'
							}`}
						>
							<HiOutlineCheck
								className={`${disabled ? 'text-gray-200' : 'text-white'}`}
								size={boxSize === 'large' ? '24px' : boxSize === 'medium' ? '20px' : '16px'}
							/>
						</div>
					)}
				</div>
				{label}
			</label>
		</div>
	);
};

export default CheckBox;
