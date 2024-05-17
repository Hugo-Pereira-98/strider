import { useEffect } from 'react';
import { maximumSpvLayerLabels } from '../StructureContent';
import Badge from '../ui/Badge';
import { formatNumber } from '@/utils/functions';

interface DealModalProps {
	company: string;
	status: string;
	action: string;
	targetSharePrice: number;
	targetValuation: number;
	amount: string;
	spv: {
		spvMaxManagement: number;
		spvMaxCarry: number;
		maxSPVLayers: number;
	};
	onClose(): void;
}

export function DealModal({
	company,
	status,
	targetSharePrice,
	targetValuation,
	action,
	amount,
	spv,
	onClose,
}: DealModalProps) {
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

	return (
		<div
			className="absolute top-14 right-0 left-0 bottom-0 backdrop-blur-sm flex justify-center items-center sm:items-start"
			onClick={onClose}
		>
			<div className="bg-white max-w-4xl h-max w-full rounded-xl shadow-large p-8 sm:mt-32 mx-8">
				<h1 className="heading-extra-small-medium mb-8">Indication details</h1>

				<div className="grid md:grid-cols-2 px-4 py-3 border-b">
					<div className="body-medium-medium text-neutral-500">Company</div>
					<div className="body-medium-medium">{company}</div>
				</div>

				<div className="grid md:grid-cols-2 px-4 py-3 border-b">
					<div className="body-medium-medium text-neutral-500">Action</div>
					<div>
						<div className="w-min">
							<Badge label={action} color={action === 'BUY' ? 'success' : 'error'} corners="pill" />
						</div>
					</div>
				</div>

				<div className="grid md:grid-cols-2 px-4 py-3 border-b">
					<div className="body-medium-medium text-neutral-500">
						{targetSharePrice > 0 ? 'Share Price' : 'Valuation'}
					</div>
					{/* Todo update division */}
					<div className="body-medium-medium">
						$ {targetSharePrice > 0 ? targetSharePrice.toFixed(2) : formatNumber(targetValuation)}
					</div>
				</div>

				{/* <div className="grid md:grid-cols-2 px-4 py-3 border-b">
          <div className="body-medium-medium text-neutral-500">
            Estimated Valuation
          </div>
          <div className="body-medium-medium">$23.0B</div>
        </div> */}

				<div className="grid md:grid-cols-2 px-4 py-3 border-b">
					<div className="body-medium-medium text-neutral-500">Status</div>
					<div>
						<div className="w-min">
							<Badge label={status} color="primary" corners="pill" />
						</div>
					</div>
				</div>

				<div className="grid md:grid-cols-2 px-4 py-3">
					<div className="body-medium-medium text-neutral-500">Volume</div>
					<div className="body-medium-medium">{amount}</div>
				</div>

				{spv.maxSPVLayers > 0 && (
					<div className="grid md:grid-cols-2 px-4 py-3 border-t">
						<div className="body-medium-medium text-neutral-500">SPV Fees</div>
						<div className="body-medium-medium">
							{spv.spvMaxManagement}% Management / {spv.spvMaxCarry}% Carry{' '}
							{spv.maxSPVLayers > 0 && `/ ${maximumSpvLayerLabels[spv.maxSPVLayers - 1 ?? 1]}`}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
