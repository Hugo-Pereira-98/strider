export function Individual({ width = '20', height = '20', ...props }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke="#667085"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.334 13c0-.93 0-1.396-.115-1.774a2.666 2.666 0 00-1.778-1.778c-.378-.115-.844-.115-1.774-.115H5.334c-.93 0-1.396 0-1.774.115a2.667 2.667 0 00-1.778 1.778c-.115.378-.115.844-.115 1.774M10 4a3 3 0 11-6 0 3 3 0 016 0z"
        {...props}
      />
    </svg>
  );
}
