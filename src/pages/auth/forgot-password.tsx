/* eslint-disable @next/next/no-html-link-for-pages */
import Button from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Form } from '@/components/ui/Form';
import InputField from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { HiArrowRight } from 'react-icons/hi2';
import * as z from 'zod';
import { SEND_RESET_PASSWORD_EMAIL } from '../../utils/mutations';
import Alert from '../../components/ui/Alert';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [sendResetPasswordEmailMutation] = useMutation(
    SEND_RESET_PASSWORD_EMAIL
  );
  const { toast } = useToast();

  const methods = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const email = watch('email');

  const handleForgotPassword = async (values: ForgotPasswordForm) => {
    try {
      const response = await sendResetPasswordEmailMutation({
        variables: {
          email: values.email,
        },
      });

      if (response.data?.sendResetPasswordEmail) {
        toast({
          title: 'Successfully sent reset email',
          description: 'Please check your email for the reset link',
        });
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (error) {
      setError('email', {
        message: 'Email not found. Please try again.',
      });
    }
  };

  return (
    <Container className="max-w-2xl space-y-12 pt-12 border-l border-neutral-100 dark:border-neutral-800  h-screen after:border after:border-primary-600 after:absolute after:top-10 after:left-0 after:h-20 relative">
      <Head>
        <title>Posterr | Forgot Password</title>
      </Head>

      <header>
        <small className="label-medium-medium md:label-large-medium text-neutral-500 uppercase">
          Account recovery
        </small>
        <h1 className="heading-extra-small-regular md:heading-medium-regular mb-1">
          Reset your password
        </h1>
      </header>

      <FormProvider {...methods}>
        <Form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-5"
        >
          <InputField
            labelText="Email"
            placeholder="Email"
            feedbackType={errors.email?.message ? 'error' : 'none'}
            feedback={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            label="Continue"
            rightIcon={<HiArrowRight className="stroke-2" />}
            disabled={isSubmitting || !email}
            loading={isSubmitting}
          />
        </Form>
      </FormProvider>

      {showAlert && (
        <Alert
          headLineText="Email has been sent."
          background="dark"
          type="success"
        />
      )}
    </Container>
  );
}
