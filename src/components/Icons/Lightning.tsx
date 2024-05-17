import { ComponentPropsWithoutRef } from "react";

interface LightningProps extends ComponentPropsWithoutRef<'path'> {
  width?: number | string;
  height?: number | string;
}

export function Lightning({ width, height, ...props }: LightningProps) {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 2L4.093 12.688c-.348.418-.523.628-.525.804a.5.5 0 00.185.397c.138.111.41.111.955.111H12l-1 8 8.907-10.688c.348-.418.523-.628.525-.804a.5.5 0 00-.185-.397c-.138-.111-.41-.111-.955-.111H12l1-8z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  )
}