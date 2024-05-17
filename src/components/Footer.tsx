export function Footer() {
  return (
    <footer className="border-t border-neutral-300 lg:border-neutral-600 lg:bg-neutral-800 text-xs sm:text-sm lg:text-white flex flex-col md:flex-row items-center justify-between gap-3 p-5 lg:py-5 lg:px-12">
      <ul className="flex items-center gap-4 lg:gap-12 flex-wrap">
        <li>Home</li>
        <li>Support</li>
        <li>About</li>
        <li>Terms of Use</li>
        <li>Privacy</li>
      </ul>

      <span>&copy; {new Date().getFullYear()} Gondola Technologies, Inc.</span>
    </footer>
  );
}
