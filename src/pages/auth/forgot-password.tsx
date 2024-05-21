import Button from '@/components/Button';
import { Container } from '@/components/ui/Container';
import { Form } from '@/components/ui/Form';
import InputField from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { openDB, resetPassword } from '@/utils/indexedDB';
import Head from 'next/head';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { HiArrowRight } from 'react-icons/hi2';
import * as z from 'zod';
import Alert from '../../components/ui/Alert';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const { toast } = useToast();

  const methods = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
      newPassword: '',
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
  const newPassword = watch('newPassword');

  const handleForgotPassword = async (values: ForgotPasswordForm) => {
    try {
      const db = await openDB();
      await resetPassword(db, values.email, values.newPassword);
      toast({
        title: 'Password reset successfully',
        description: 'You can now log in with your new password',
      });
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
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
          <InputField
            labelText="New Password"
            placeholder="New Password"
            feedbackType={errors.newPassword?.message ? 'error' : 'none'}
            feedback={errors.newPassword?.message}
            type="password"
            {...register('newPassword')}
          />

          <Button
            type="submit"
            label="Continue"
            rightIcon={<HiArrowRight className="stroke-2" />}
            disabled={isSubmitting || !email || !newPassword}
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
