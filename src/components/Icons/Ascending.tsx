export function Ascending({ width = '18', height = '18', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 13 13"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11 13L6 8l-5 5m10-7L6 1 1 6"
        {...props}
      />
    </svg>
  );
}
