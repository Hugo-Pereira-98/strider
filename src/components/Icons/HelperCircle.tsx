export function HelperCircle({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <g clipPath="url(#clip0_2209_5920)">
        <path
          stroke="#85888E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.333"
          {...props}
          d="M6.06 6a2 2 0 013.887.667c0 1.333-2 2-2 2M8 11.333h.007M14.667 8A6.667 6.667 0 111.333 8a6.667 6.667 0 0113.334 0z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_2209_5920">
          <path fill="#fff" d="M0 0H16V16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
