export function ChevronRight({ width = '20', height = '20', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="12"
      fill="none"
      viewBox="0 0 6 10"
    >
      <path
        stroke="#475467"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.167"
        d="M1.25 8.5L4.75 5l-3.5-3.5"
        {...props}
      />
    </svg>
  );
}
