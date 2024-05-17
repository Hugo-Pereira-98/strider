import { ComponentPropsWithoutRef } from "react";

interface RouteProps extends ComponentPropsWithoutRef<'path'> {
  width?: number | string;
  height?: number | string;
}

export function Route({ width, height, ...props }: RouteProps) {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 5h.434c3.048 0 4.571 0 5.15.547a2 2 0 01.586 1.845c-.156.781-1.4 1.66-3.888 3.42l-4.064 2.876c-2.488 1.76-3.732 2.639-3.888 3.42a2 2 0 00.586 1.845c.579.547 2.102.547 5.15.547h.934M8 5a3 3 0 11-6 0 3 3 0 016 0zm14 14a3 3 0 11-6 0 3 3 0 016 0z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  )
}