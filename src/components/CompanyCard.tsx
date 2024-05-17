import StandardButton from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface CompanyCardProps {
	name: string;
	description?: string;
	subtitle?: string;
	logo: string;
	funding: string;
}

export function CompanyCard({
	name,
	logo,
	description = 'Company Description',
	subtitle = 'Company Subtitle',
	funding,
}: CompanyCardProps) {
	const router = useRouter();

	return (
		<div className="w-min min-w-[20rem] sm:min-w-[17rem] md:min-w-[20rem] lg:w-[23.75rem] min-h-[27.5rem] bg-white rounded-md shadow border border-zinc-300 space-y-4 flex flex-col text-left p-8">
			<div className="flex items-center self-stretch gap-5">
				<div>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={logo} width={40} height={40} alt="" />
				</div>
				<div>
					<p className="text-neutral-600 body-extra-large-medium">{name}</p>
					<p className="text-neutral-400 body-medium-medium">{subtitle}</p>
				</div>
			</div>

			<div className="flex-1">
				<div className="text-neutral-600 body-small-regular">{description}</div>
			</div>

			<div className="space-y-1">
				<div className="text-neutral-400 label-medium-medium">Investors</div>
				<div className="text-neutral-600 body-small-medium">
					Elon Musk, Founders Fund, Google Ventures, Valor Equity Partners, Fidelity Investments
				</div>
			</div>
			<div className="space-y-1">
				<div className="text-neutral-400 label-medium-medium">Total Funding</div>
				<div className="text-neutral-600 body-small-medium">{funding}</div>
			</div>

			<StandardButton
				buttonType="secondary"
				corners="smooth"
				label="I'm interested"
				onClick={() => router.push(`/company/${name}`)}
			/>
		</div>
	);
}
