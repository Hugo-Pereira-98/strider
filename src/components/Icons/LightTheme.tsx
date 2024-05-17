export function LightTheme({ width = '20', height = '20', ...props }) {
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
        d="M8 1.333v1.334m0 10.666v1.334M2.666 8H1.333m2.876-3.79l-.943-.943m8.524.942l.943-.942M4.21 11.793l-.943.943m8.524-.943l.943.943M14.666 8h-1.333m-2 0a3.333 3.333 0 11-6.667 0 3.333 3.333 0 016.667 0z"
        {...props}
      />
    </svg>
  );
}
