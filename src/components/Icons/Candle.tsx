import { ComponentPropsWithoutRef } from "react";

interface CandleProps extends ComponentPropsWithoutRef<'path'> {
	width?: number | string;
	height?: number | string;
}

export function Candle({ width, height, ...props }: CandleProps) {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 2a1 1 0 10-2 0v2a3 3 0 00-3 3v7a3 3 0 003 3v3a1 1 0 102 0v-3a3 3 0 003-3V7a3 3 0 00-3-3V2zm1 12a1 1 0 01-1 1h-2a1 1 0 01-1-1V7a1 1 0 011-1h2a1 1 0 011 1v7zM8 22v-2a3 3 0 003-3v-5a3 3 0 00-3-3V5a1 1 0 00-2 0v4a3 3 0 00-3 3v5a3 3 0 003 3v2a1 1 0 102 0zm0-11H6a1 1 0 00-1 1v5a1 1 0 001 1h2a1 1 0 001-1v-5a1 1 0 00-1-1z"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
        {...props}
      />
    </svg>
  )
}
