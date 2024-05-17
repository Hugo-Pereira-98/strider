import React, { useState, useEffect } from 'react';

type Props = {
  value: boolean;
  radioSize?: 'small' | 'medium' | 'large';
  state?: 'active' | 'hovered' | 'focused' | 'disabled';
  disabled?: boolean;
  label?: string;
  onChange?: (newState: boolean) => void;
};

const sizes = {
  small: '16px',
  medium: '20px',
  large: '24px',
};

const RadioButton: React.FC<Props> = ({
  value,
  disabled = false,
  radioSize = 'medium',
  state = 'active',
  label,
  onChange,
}) => {
  const finalState = disabled ? 'disabled' : state;
  const [interactionState, setInteractionState] = useState(finalState);
  const [radioButtonState, setRadioButtonState] = useState(value);

  useEffect(() => {
    setRadioButtonState(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      const newState = !radioButtonState;
      setRadioButtonState(newState);
      if (onChange) {
        onChange(newState);
      }
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!disabled && radioButtonState) {
      event.preventDefault();
      setRadioButtonState(false);
      if (onChange) {
        onChange(false);
      }
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center cursor-pointer`}
      style={{ height: sizes[radioSize], width: sizes[radioSize] }}
      onMouseEnter={() =>
        interactionState !== 'disabled' && setInteractionState('hovered')
      }
      onMouseLeave={() =>
        interactionState !== 'disabled' && setInteractionState(finalState)
      }
      onFocus={() =>
        interactionState !== 'disabled' && setInteractionState('focused')
      }
      onBlur={() =>
        interactionState !== 'disabled' && setInteractionState(finalState)
      }
    >
      <label
        className={`relative flex items-center ${
          disabled ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <input
          type="radio"
          style={{ appearance: 'none', outline: 'none' }}
          className={`absolute h-full w-full ${
            disabled ? 'cursor-default' : 'cursor-pointer'
          }`}
          checked={radioButtonState}
          disabled={interactionState === 'disabled'}
          onChange={handleChange}
          onClick={handleClick}
        />

        <div
          className={`relative flex justify-center items-center rounded-full p-1 shadow-medium ${
            interactionState === 'hovered' ? 'shadow-hover-primary' : ''
          } ${interactionState === 'focused' ? 'shadow-focus-primary' : ''} ${
            interactionState === 'disabled'
              ? radioButtonState
                ? 'bg-primary-50'
                : 'bg-gray-200'
              : radioButtonState
              ? 'bg-primary-600'
              : 'bg-white'
          }`}
        >
          {radioButtonState ? (
            <div
              className={`rounded-full  ${
                interactionState === 'disabled' ? 'bg-primary-20' : 'bg-white'
              } ${
                radioSize === 'large'
                  ? 'w-4 h-4'
                  : radioSize === 'medium'
                  ? 'w-3 h-3'
                  : 'w-2 h-2'
              }`}
            ></div>
          ) : (
            <div
              className={`rounded-full ${
                interactionState === 'disabled' ? 'bg-gray-200' : 'bg-white'
              }`}
            >
              <div
                className={`rounded-full ${
                  interactionState === 'disabled' ? 'bg-gray-200' : 'bg-white'
                } ${
                  radioSize === 'large'
                    ? 'w-4 h-4'
                    : radioSize === 'medium'
                    ? 'w-3 h-3'
                    : 'w-2 h-2'
                }`}
              ></div>
            </div>
          )}
        </div>

        {label && <span className="ml-2">{label}</span>}
      </label>
    </div>
  );
};

export default RadioButton;
