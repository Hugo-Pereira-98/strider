export function DarkTheme({ width = '20', height = '20', ...props }) {
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
        d="M14.666 10.563a6.975 6.975 0 01-9.23-9.23 6.976 6.976 0 109.23 9.23z"
        {...props}
      />
    </svg>
  );
}
