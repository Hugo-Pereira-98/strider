import classNames from 'classnames';
import { useEffect } from 'react';

interface CollapseSidebarProps {
	open: boolean;
	onChange(open: boolean): void;
	children: React.ReactNode;
}

export function CollapseSidebar({
	open,
	onChange,
	children,
}: CollapseSidebarProps) {
	useEffect(() => {
		function handleCloseMenuByEsc(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				onChange(false);
			}
		}

		window.addEventListener('keydown', handleCloseMenuByEsc);

		return () => {
			window.removeEventListener('keydown', handleCloseMenuByEsc);
		};
	}, [onChange]);

	return (
		<nav
			className={classNames(
				{ 'left-0 duration-150 border-r': open },
				'bg-white w-[18.75rem] h-screen flex flex-col fixed top-0 -left-full duration-150 transition-all px-5 py-8 z-10 mt-16 sm:mt-24',
			)}
		>
			{children}
		</nav>
	);
}
