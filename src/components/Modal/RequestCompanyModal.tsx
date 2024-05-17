import { useToast } from '@/hooks/useToast';
import { REQUEST_SPECIFIC_COMPANY } from '@/utils/mutations';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Close } from '../Icons/Close';
import Button from '../ui/Button';
import { Form } from '../ui/Form';
import InputField from '../ui/Input';

interface RequestCompanyModalProps {
  open: boolean;
  onClose(): void;
  companyName?: string;
}

export function RequestCompanyModal({
  open,
  companyName,
  onClose,
}: RequestCompanyModalProps) {
  const { toast } = useToast();
  const methods = useForm({
    defaultValues: {
      companyName: companyName || '',
      website: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

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

  const [requestSpecificCompany, { loading }] = useMutation(
    REQUEST_SPECIFIC_COMPANY
  );
  const handleRequestSpecificCompany = async (values: {
    companyName: string;
    website: string;
  }) => {
    const res = await requestSpecificCompany({
      variables: {
        input: {
          companyName: values.companyName,
          companyWebsite: values.website,
        },
      },
    });

    return res;
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 z-[999] px-4">
      <div className="bg-white dark:bg-gray-dark-950 rounded-xl p-6 max-w-[640px] w-full z-[999] relative">
        <div className="dark:hidden">
          <Image
            src="/assets/featured-company-header-content.svg"
            width={200}
            height={200}
            className="absolute top-0 left-0 -z-10"
            alt=""
          />
        </div>

        <div className="hidden dark:block">
          <Image
            src="/assets/featured-company-header-content-dark.svg"
            width={200}
            height={200}
            className="absolute top-0 left-0 -z-10"
            alt=""
          />
        </div>

        <button className="absolute right-6 z-10" onClick={onClose}>
          <Close />
        </button>

        <div className="pl-14 relative pb-4">
          <p className="body-large-semibold text-gray-light-950 dark:text-gray-dark-50">
            Request a Company
          </p>
          <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 max-w-lg">
            Help us improve our data offering by telling us which company we
            should prioritize
          </p>
        </div>

        <FormProvider {...methods}>
          <Form
            onSubmit={handleSubmit(async (values) => {
              const res = await handleRequestSpecificCompany({
                companyName: values.companyName,
                website: values.website,
              });

              if (res.data) {
                toast({
                  type: 'success',
                  title: 'Request received',
                  description: `Your request to add ${values.companyName} Company has been received.`,
                });

                onClose();
              }
            })}
          >
            <div className="space-y-4">
              <InputField
                labelText="Company Name"
                placeholder="Company Name"
                feedbackType={errors.companyName?.message ? 'error' : 'none'}
                feedback={errors.companyName?.message}
                {...register('companyName')}
              />
              <InputField
                labelText="Website"
                placeholder="www.example.com"
                feedbackType={errors.website?.message ? 'error' : 'none'}
                feedback={errors.website?.message}
                leadIcon={
                  <div className="border-r h-full flex items-center pr-3 pl-3 border-gray-light-300 dark:border-gray-dark-700 text-gray-light-600 dark:text-gray-dark-500">
                    https://
                  </div>
                }
                customLead
                {...register('website')}
              />
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Button
                label="Cancel"
                buttonType="secondaryGray"
                onClick={onClose}
              />
              <Button type="submit" label="Submit" disabled={loading} />
            </div>
          </Form>
        </FormProvider>
      </div>

      <div
        className="fixed inset-0 bg-gray-light-950/70 dark:bg-gray-dark-800/70 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
}
