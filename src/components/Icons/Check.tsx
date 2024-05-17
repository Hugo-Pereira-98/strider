import React, { SVGProps } from 'react';

export function Check({
  className,
  ...props
}: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={`stroke-current ${className}`}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        strokeWidth="1.6666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
