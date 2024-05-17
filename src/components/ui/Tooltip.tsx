import React from 'react';
import { HiXMark } from 'react-icons/hi2';
import { BsTriangleFill } from 'react-icons/bs';

const TooltipStyles = {
  light: 'bg-white text-neutral-600 shadow-lg',
  dark: 'bg-neutral-600 text-white shadow-lg',
};
const ArrowStyles = {
  light: 'text-white bg-transparent',
  dark: 'text-neutral-600 bg-transparent',
};

const CornerTypes = {
  smooth: 'rounded-md',
  sharp: 'rounded-none',
  pill: 'rounded-full',
};

const SizeProperties = {
  small: 'p-3',
  medium: 'p-4',
  large: 'p-5',
};

const ArrowOrientation = {
  up: 'top-0 left-1/2 mt-[1px] transform -translate-x-1/2 -translate-y-full',
  down: 'bottom-0 left-1/2 mb-[1px] transform -translate-x-1/2 translate-y-full rotate-180',
  left: 'top-1/2 left-0 ml-[1px] transform -translate-x-full -translate-y-1/2 -rotate-90',
  right:
    'top-1/2 right-0 mr-[1px] transform translate-x-full -translate-y-1/2 rotate-90',
};

interface TooltipProps {
  background?: 'light' | 'dark';
  corners?: 'smooth' | 'sharp' | 'pill';
  size?: 'small' | 'medium' | 'large';
  pointedArrow?: 'none' | 'up' | 'down' | 'left' | 'right';
  rightIconClose?: boolean;
  headLineText?: string;
  supportingText?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  background = 'light',
  corners = 'smooth',
  size = 'medium',
  pointedArrow = 'none',
  rightIconClose = true,
  headLineText,
  supportingText,
}) => (
  <div
    className={`relative max-w-xs w-full h-min  ${TooltipStyles[background]} ${CornerTypes[corners]} ${SizeProperties[size]} flex flex-col gap-2 z-10`}
  >
    <div className="flex items-start justify-between w-full ">
      <p className="body-extra-small-semibold">{headLineText}</p>
      {rightIconClose && (
        <HiXMark className="h-4 w-4 text-current " aria-hidden="true" />
      )}
    </div>
    {supportingText && (
      <p className="body-extra-small-regular">{supportingText}</p>
    )}
    {pointedArrow && pointedArrow !== 'none' && (
      <BsTriangleFill
        className={`absolute w-3 h-3 ${ArrowOrientation[pointedArrow]} ${ArrowStyles[background]} z-0`}
      />
    )}
  </div>
);

export default Tooltip;
