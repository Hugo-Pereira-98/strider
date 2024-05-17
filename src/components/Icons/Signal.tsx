interface SidebarProps {
  strokeColor?: string;
  width?: number;
  height?: number;
}

export function Signal({ strokeColor, width, height, ...props }: SidebarProps) {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.12"
        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
        fill="black"
      />
      <path
        d="M16.2426 7.75714C18.5858 10.1003 18.5858 13.8993 16.2426 16.2424M7.75736 16.2424C5.41421 13.8992 5.41421 10.1002 7.75736 7.7571M4.92893 19.0708C1.02369 15.1656 1.02369 8.83395 4.92893 4.92871M19.0711 4.92876C22.9763 8.834 22.9763 15.1656 19.0711 19.0709M14 11.9998C14 13.1043 13.1046 13.9998 12 13.9998C10.8954 13.9998 10 13.1043 10 11.9998C10 10.8952 10.8954 9.99978 12 9.99978C13.1046 9.99978 14 10.8952 14 11.9998Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={strokeColor}
        {...props}
      />
    </svg>
  );
}
