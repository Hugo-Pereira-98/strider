import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import classNames from 'classnames';

interface CardProps {
	smallTitle: string;
	title: string;
	subtitle?: string;
	titleSupport?: {
		icon: IconType;
		title: string;
		name: string;
	};
	gap?: string;
	children: React.ReactNode;
}

export function AuthCard({
	smallTitle,
	title,
	subtitle,
	titleSupport,
	gap = 'gap-7',
	children,
}: CardProps) {
	const pathname = usePathname();
	const re = /signin/;
	const isSignInPage = re.test(pathname);

	return (
		<div
			className={classNames(
				{ 'animate-fadeIn': !isSignInPage },
				'lg:bg-white lg:rounded-md lg:p-12 flex flex-col',
				gap,
			)}
		>
			<header>
				<small className="label-medium-medium md:label-large-medium text-neutral-500 uppercase">
					{smallTitle}
				</small>
				<h1 className="heading-extra-small-regular md:heading-medium-regular mb-1">{title}</h1>
				{titleSupport && (
					<div className="flex items-center gap-2 body-small-regular text-neutral-500 mt-2">
						<titleSupport.icon className="w-5 h-5 stroke-2" />
						<b>{titleSupport.title}</b>
						<p>{titleSupport.name}</p>
					</div>
				)}
				{subtitle && <p className="body-small-regular text-neutral-500">{subtitle}</p>}
			</header>

			{children}
		</div>
	);
}
