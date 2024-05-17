import { ComponentPropsWithoutRef } from "react";

interface LightningProps extends ComponentPropsWithoutRef<'path'> {
  width?: number | string;
  height?: number | string;
}

export function LifeBuoy({ width = 24, height = 24, ...props }: LightningProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={0.12} fill="#000">
        <path d="M9.207 14.793A3.988 3.988 0 018 11.929c0-1.087.433-2.072 1.136-2.793L4.93 4.93c-3.905 3.905-3.905 10.237 0 14.142l4.278-4.278zM14.79 9.207a3.988 3.988 0 011.207 2.864 3.987 3.987 0 01-1.136 2.793l4.207 4.207c3.906-3.905 3.906-10.237 0-14.142L14.79 9.207z" />
      </g>
      <path
        d="M9.136 9.136L4.93 4.93m0 14.142l4.239-4.239m5.693.032l4.207 4.207m0-14.142l-4.24 4.24M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-6 0a4 4 0 11-8 0 4 4 0 018 0z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg >
  );
}
