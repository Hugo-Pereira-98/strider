export function SystemTheme({ width = '20', height = '20', ...props }) {
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
        d="M1.333 8.333h13.333M5.333 13h5.333m-6.133-2h6.933c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874c.218-.428.218-.988.218-2.108V4.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C13.146 1 12.586 1 11.466 1H4.533c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874c-.218.428-.218.988-.218 2.108v3.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874c.428.218.988.218 2.108.218z"
        {...props}
      />
    </svg>
  );
}
