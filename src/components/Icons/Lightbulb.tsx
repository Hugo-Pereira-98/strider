import { ComponentPropsWithoutRef } from "react";

interface LightbulbProps extends ComponentPropsWithoutRef<'path'> {
	width?: number | string;
	height?: number | string;
}

export function Lightbulb({ width, height, ...props }: LightbulbProps) {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 22h5m.5-6.674a7 7 0 10-6 0V16c0 .932 0 1.398.152 1.765a2 2 0 001.083 1.083C10.602 19 11.068 19 12 19c.932 0 1.398 0 1.765-.152a2 2 0 001.083-1.083C15 17.398 15 16.932 15 16v-.674z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  )
}
