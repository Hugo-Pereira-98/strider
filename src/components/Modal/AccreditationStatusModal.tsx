import { HiArrowRight, HiOutlineClock } from 'react-icons/hi2';
import Button from '../Button';

interface AccreditationStatusModalProps {
  isVisible: boolean;
  onClose(): void;
}

export function AccreditationStatusModal({
  onClose,
}: AccreditationStatusModalProps) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex justify-center items-center sm:items-start"
      onClick={onClose}
    >
      <div className="bg-white max-w-4xl h-max w-full grid grid-cols-1 md:grid-cols-2 gap-7 rounded-xl shadow-large p-8 sm:mt-32 mx-8">
        <div className="bg-[url(/assets/waitlist.png)] bg-cover bg-no-repeat hidden md:block rounded-md" />
        <div className="space-y-7">
          <div>
            <p className="label-large-medium text-neutral-500">
              You&apos;re almost there
            </p>
            <h2 className="heading-medium-regular mt-1">
              We need to verify your accreditation status
            </h2>
          </div>
          <p className="body-small-regular text-neutral-500">
            Federal law requires that we verify you are an accredited investor
            before providing you with investment opportunities in private
            companies.
          </p>

          <time className="body-medium-semibold flex items-center gap-2">
            <HiOutlineClock />
            Estimated time: 1 minute
          </time>

          <Button
            label="Continue"
            onClick={onClose}
            rightIcon={<HiArrowRight />}
          />
        </div>
      </div>
    </div>
  );
}
