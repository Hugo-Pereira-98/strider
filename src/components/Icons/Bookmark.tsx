import React, { SVGProps } from 'react';

interface BookmarkProps extends SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export function Bookmark({
  width = 20,
  height = 20,
  filled,
  onClick,
  ...props
}: BookmarkProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...props}
    >
      <path
        d="M1 5.8c0-1.68 0-2.52.327-3.162a3 3 0 011.311-1.311C3.28 1 4.12 1 5.8 1h4.4c1.68 0 2.52 0 3.162.327a3 3 0 011.311 1.311C15 3.28 15 4.12 15 5.8V19l-7-4-7 4V5.8z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
