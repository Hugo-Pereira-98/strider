import { ComponentPropsWithoutRef } from "react";

interface TargetIconProps extends ComponentPropsWithoutRef<'path'> {
  width?: number | string;
  height?: number | string;
}

export function TargetIcon({ width, height, ...props }: TargetIconProps) {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 8V5l3-3 1 2 2 1-3 3h-3zm0 0l-4 4m10 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m5 10a5 5 0 11-5-5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  )
}