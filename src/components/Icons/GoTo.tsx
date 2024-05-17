export function GoTo({ width = '24', height = '24', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="5 5 14 14"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5.833 14.167L14.167 5.833m0 0H5.833m8.334 0v8.334"
      />
    </svg>
  );
}
