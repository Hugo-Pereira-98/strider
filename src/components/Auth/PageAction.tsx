import Link from 'next/link';

interface PageActionProps {
	label: string;
	link: {
		href: string;
		text: string;
	};
}

export function PageAction({ label, link }: PageActionProps) {
	return (
		<div className="text-neutral-600 lg:text-neutral-300 text-center">
			<p className="body-small-regular">{label}</p>
			<Link href={link.href} className="underline text-sm">
				{link.text}
			</Link>
		</div>
	);
}
