import { useEffect } from 'react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { Close } from '../Icons/Close';
import Image from 'next/image';

interface ArchiveIndicationModalProps {
	open: boolean;
	onClose(): void;
}

export function ArchiveIndicationModal({ open, onClose }: ArchiveIndicationModalProps) {
	const router = useRouter();

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			onClose();
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	});

	useEffect(() => {
		if (open) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}

		return () => {
			document.body.classList.remove('overflow-hidden');
		};
	}, [open]);

	return (
		<div className="flex justify-center items-center fixed inset-0 z-[999] px-4">
			<div className="bg-white dark:bg-gray-dark-950 rounded-xl p-6 max-w-[544px] w-full z-[999] relative">
				<div className="dark:hidden">
					<Image
						src="/assets/featured-archive-indication-header-content.svg"
						width={200}
						height={200}
						className="absolute top-0 left-0 -z-10"
						alt=""
					/>
				</div>

				<div className="hidden dark:block">
					<Image
						src="/assets/featured-archive-indication-header-content-dark.svg"
						width={200}
						height={200}
						className="absolute top-0 left-0 -z-10"
						alt=""
					/>
				</div>

				<button className="absolute right-6 z-10" onClick={onClose}>
					<Close />
				</button>

				<div className="pl-14">
					<p className="body-large-semibold text-gray-light-950 dark:text-gray-dark-50">
						Archive indication
					</p>
					<p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
						Are you sure you want to archive this indication?
					</p>
				</div>

				<div className="flex items-center justify-end gap-3 mt-8">
					<div>
						<Button label="Cancel" buttonType="secondaryGray" onClick={onClose} />
					</div>
					<div>
						<Button label="Confirm" onClick={onClose} />
					</div>
				</div>
			</div>

			<div className="fixed inset-0 bg-gray-light-950/70 dark:bg-gray-dark-800/70 backdrop-blur-sm" onClick={onClose} />
		</div>
	);
}
