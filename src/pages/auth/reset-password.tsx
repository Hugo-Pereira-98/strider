/* eslint-disable @next/next/no-html-link-for-pages */
import Button from '@/components/Button';
import { Container } from '@/components/ui/Container';
import { Form } from '@/components/ui/Form';
import InputField from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { HiArrowRight } from 'react-icons/hi2';
import * as z from 'zod';

const passwordValidation = z
  .string()
  .min(8, 'At least 8 characters')
  .refine((val) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).*$/.test(
      val
    )
  );

const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const methods = useForm<ResetPasswordForm>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const handleForgotPassword = async (values: ResetPasswordForm) => {
    const ok = values.password && values.confirmPassword;

    if (ok) {
    }
  };

  return (
    <Container className="max-w-2xl space-y-12 pt-12 border-l border-neutral-100 dark:border-neutral-800  h-screen after:border after:border-primary-600 after:absolute after:top-10 after:left-0 after:h-20 relative">
      <Head>
        <title>Posterr | Reset Password</title>
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
            labelText="Password"
            type="password"
            strengthIndicator
            placeholder="Minimum 8 characters"
            feedbackType={errors.password?.message ? 'error' : 'none'}
            feedback={errors.password?.message}
            {...register('password')}
          />

          <InputField
            labelText="Confirm Password"
            type="password"
            strengthIndicator
            placeholder="Minimum 8 characters"
            feedbackType={errors.confirmPassword?.message ? 'error' : 'none'}
            feedback={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            label="Reset password"
            rightIcon={<HiArrowRight className="stroke-2" />}
            disabled={isSubmitting || !password || !confirmPassword}
            loading={isSubmitting}
          />
        </Form>
      </FormProvider>
    </Container>
  );
}
