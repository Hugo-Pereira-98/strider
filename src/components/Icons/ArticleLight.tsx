export function ArticleLight({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      fill="none"
      viewBox="0 0 20 18"
    >
      <path
        stroke="#344054"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 6.25h-6M19 1H1m18 10.75h-6M19 17H1m1.6-4h4.8c.56 0 .84 0 1.054-.109a1 1 0 00.437-.437C9 12.24 9 11.96 9 11.4V6.6c0-.56 0-.84-.109-1.054a1 1 0 00-.437-.437C8.24 5 7.96 5 7.4 5H2.6c-.56 0-.84 0-1.054.109a1 1 0 00-.437.437C1 5.76 1 6.04 1 6.6v4.8c0 .56 0 .84.109 1.054a1 1 0 00.437.437C1.76 13 2.04 13 2.6 13z"
        {...props}
      ></path>
    </svg>
  );
}
