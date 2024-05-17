import React, { SVGProps } from 'react';

export function ArrowRight({
  className,
  ...props
}: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} flex h-min`}
      {...props}
    >
      <path
        d="M4.16667 10H15.8333M15.8333 10L10 15.8333M15.8333 10L10 4.16667"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
