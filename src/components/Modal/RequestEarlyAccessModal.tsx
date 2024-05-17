import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { Close } from '../Icons/Close';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession } from '@/hooks/useSession';
import { Form } from '../ui/Form';
import InputField from '../ui/Input';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';

interface RequestEarlyAccessModalProps {
  open: boolean;
  setIsOnTheWaitList(value: boolean): void;
  onClose(): void;
}

const earlyAccessSchema = z.object({
  name: z.string().min(1, "Name can't be empty"),
  email: z.string().email(),
});

type EarlyAccessForm = z.infer<typeof earlyAccessSchema>;

export function RequestEarlyAccessModal({
  open,
  onClose,
  setIsOnTheWaitList,
}: RequestEarlyAccessModalProps) {
  const router = useRouter();
  const { session } = useSession();

  const methods = useForm<EarlyAccessForm>({
    resolver: zodResolver(earlyAccessSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleSubmitForm = async (data: EarlyAccessForm) => {
    setIsOnTheWaitList(true);
    onClose();
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

  useEffect(() => {
    methods.reset({
      name: session?.name,
      email: session?.email,
    });
  }, [methods, session]);

  return (
    <div className="flex justify-center items-center fixed inset-0 z-[999] px-4">
      <FormProvider {...methods}>
        <Form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="
						bg-white dark:bg-gray-dark-950 rounded-xl
						p-6 max-w-[400px] w-full z-[999] relative
						dark:bg-[url(/assets/auth-bg-pattern-dark.svg)] bg-[center_top]
						bg-no-repeat bg-contain
					"
        >
          <button
            className="text-white absolute right-6 z-10"
            onClick={onClose}
          >
            <Close stroke="#667085" />
          </button>

          <p className="body-large-semibold text-center text-gray-light-950 dark:text-gray-dark-50">
            Join early access program
          </p>
          <p className="body-small-regular text-center text-gray-light-600 dark:text-gray-dark-400">
            Gain early access to the Gondola Live Market.
          </p>

          <div className="flex flex-col gap-3 mt-3">
            <InputField
              labelText="Name"
              placeholder="Name"
              feedbackType={errors.name?.message ? 'error' : 'none'}
              feedback={errors.name?.message}
              {...register('name')}
            />
            <InputField
              labelText="Email"
              placeholder="Enter your email"
              feedbackType={errors.email?.message ? 'error' : 'none'}
              feedback={errors.email?.message}
              trailIcon={
                errors.email?.message && (
                  <HiOutlineExclamationCircle className="text-base text-error-500 dark:text-error-400" />
                )
              }
              {...register('email')}
            />
          </div>

          <div className="flex items-center gap-3 mt-8">
            <Button
              type="submit"
              label="Join waitlist"
              disabled={isSubmitting}
            />
          </div>
        </Form>
      </FormProvider>

      <div
        className="fixed inset-0 bg-gray-light-950/70 dark:bg-gray-dark-800/70 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
}
