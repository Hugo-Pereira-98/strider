import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from '../Icons/ChevronDown';
import { useRouter } from 'next/router';

interface MenuItem {
	url?: string;
	text: string;
}

interface SelectDownProps {
	menuItems: MenuItem[];
	isAnchor?: boolean;
	selectedItem?: string;
	setSelectedItem?(selectedItem: string): void;
	clear?(): void;
}

export function SelectDown({
	selectedItem,
	setSelectedItem,
	isAnchor = true,
	menuItems,
	clear,
}: SelectDownProps) {
	const router = useRouter();
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const [dropdownVisible, setDropdownVisible] = useState(false);

	const handleSelect = (option: MenuItem) => {
		if (isAnchor && option.url) {
			router.push(option.url);
		}

		setSelectedItem?.(option.text);
		clear?.();
		setDropdownVisible(false);
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownVisible(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const value = router.pathname.includes('watchlist')
		? 'Watchlist'
		: router.pathname.includes('most-active')
		? 'Most Active'
		: router.pathname.includes('financings')
		? 'Financings'
		: menuItems[0].text;

	return (
		<div className="relative flex flex-col items-center w-full max-w-[400px] rounded-md">
			<button
				onClick={() => setDropdownVisible((prev) => !prev)}
				className="shadow-medium focus:shadow-focus-primary rounded-md p-2 px-4 outline-none max-w-[400px] w-full h-[46px] flex items-center justify-between"
			>
				{isAnchor ? value : selectedItem || menuItems[0].text}
				<ChevronDown />
			</button>

			{dropdownVisible && (
				<div
					ref={dropdownRef}
					className="shadow-medium rounded-md top-14 overflow-auto max-h-60 absolute z-[60] w-full bg-white dark:bg-gray-dark-950"
				>
					{menuItems.map((menuItem) => (
						<ul key={menuItem.text}>
							<li className="hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 py-2 px-4 cursor-pointer" onClick={() => handleSelect(menuItem)}>{menuItem.text}</li>
						</ul>
					))}
				</div>
			)}
		</div>
	);
}
