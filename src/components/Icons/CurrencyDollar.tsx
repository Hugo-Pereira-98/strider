import React from 'react';

interface CurrencyDollarProps {
  className?: string;
}

export function CurrencyDollar({ className }: CurrencyDollarProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 14 22"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.66667"
        d="M1 15a4 4 0 004 4h4a4 4 0 000-8H5a4 4 0 110-8h4a4 4 0 014 4M7 1v20"
      ></path>
    </svg>
  );
}
