import { useRef } from 'react';
import { HiCheckBadge, HiCloudArrowUp } from 'react-icons/hi2';

export interface UploadProgress {
	label: string;
	uploadPercentage: number;
}

interface UploadDocumentProps {
	onFileUpload: (files: File[], progressCallback: (progress: UploadProgress) => void) => void;
	onProgressUpdate: (progress: UploadProgress) => void;
	uploadedFiles: File[];
	setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
	acceptedFileTypes: string[];
}

export function UploadDocument({
	onFileUpload,
	onProgressUpdate,
	uploadedFiles,
	acceptedFileTypes,
}: UploadDocumentProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const acceptAttribute = acceptedFileTypes.join(', ');

	const handleBrowseClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;

		if (files) {
			const filesArray = Array.from(files);
			onFileUpload(filesArray, onProgressUpdate);
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();

		const files = event.dataTransfer.files;

		if (files) {
			const filesArray = Array.from(files);
			onFileUpload(filesArray, onProgressUpdate);
		}
	};

	return (
		<div
			className="flex flex-col items-center justify-center w-full h-full mb-4 border-2 border-dashed border-primary-600 bg-primary-10 rounded-md p-5"
			onDrop={handleDrop}
			onDragOver={(e) => e.preventDefault()}
		>
			<input
				ref={fileInputRef}
				type="file"
				accept={acceptAttribute}
				onChange={handleFileUpload}
				multiple
				className="hidden"
			/>
			<div className="text-primary-140">
				{uploadedFiles.length > 0 ? (
					<HiCheckBadge className="text-primary-120 w-12 h-12 " />
				) : (
					<HiCloudArrowUp className="text-primary-120 w-12 h-12" />
				)}
			</div>
			<p className="text-neutral-600 body-large-semibold mb-1 mt-2">
				{uploadedFiles.length > 0
					? `${uploadedFiles.length} file(s) uploaded`
					: `Drag & drop files or `}
				{uploadedFiles.length === 0 && (
					<button
						type="button"
						onClick={handleBrowseClick}
						className="underline text-primary-120 body-large-semibold"
					>
						Browse
					</button>
				)}
			</p>

			<p className="text-neutral-500 body-extra-small-regular">
				{acceptedFileTypes.length > 0
					? `Supported formats: ${acceptedFileTypes.join(', ')}`
					: 'Supported formats: PDF, JPEG, JPG, PNG, and TIFF'}
			</p>
		</div>
	);
}
