/* eslint-disable @next/next/no-html-link-for-pages */
import { FeaturedIcon } from '@/components/FeaturedIcon';
import { Atom } from '@/components/Icons/Atom';
import Button from '@/components/Button';
import { Container } from '@/components/ui/Container';
import { Form } from '@/components/ui/Form';
import InputField from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from 'cookies-next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import * as z from 'zod';
import { openDB, getUsers } from '../../utils/indexedDB';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const methods = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const email = watch('email');
  const password = watch('password');

  const handleSignIn = async (values: SignInForm) => {
    try {
      const db = await openDB();
      const users = await getUsers(db);

      const user = users.find((user) => user.email === values.email);

      if (!user) {
        setError('email', { message: 'User not found' });
        toast({ title: 'Error signing in', description: 'User not found' });
        return;
      }

      const decodedPassword = Buffer.from(user.password, 'base64').toString(
        'utf-8'
      );
      if (decodedPassword !== values.password) {
        setError('password', { message: 'Invalid password' });
        toast({ title: 'Error signing in', description: 'Invalid password' });
        return;
      }

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          userName: user.userName,
          userId: user.userId,
        }),
      });

      if (response.ok) {
        toast({ title: 'Signed in successfully' });
        router.push('/feed');
      } else {
        const errorData = await response.json();
        setError('email', { message: errorData.message });
        toast({ title: 'Error signing in', description: errorData.message });
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({ title: 'Error signing in', description: error.message });
    }
  };

  const idCookie = getCookie('posterr-id');
  if (idCookie) {
    router.push('/feed');
  }

  return (
    <Container className="max-w-xl space-y-8 pt-12 md:pt-24 bg-[url(/assets/auth-bg-pattern.svg)] dark:bg-[url(/assets/auth-bg-pattern-dark.svg)] bg-[center_top] bg-no-repeat">
      <Head>
        <title>Posterr | Sign in</title>
      </Head>

      <header className="flex flex-col items-center">
        <FeaturedIcon>
          <Atom className="fill-gray-light-700 dark:fill-gray-dark-300" />
        </FeaturedIcon>
        <h1 className="heading-extra-small-semibold md:heading-small-semibold text-gray-light-950 dark:text-gray-dark-50 mb-3 mt-6">
          Sign in to Posterr
        </h1>
        <h2 className="body-medium-regular text-gray-light-600 dark:text-gray-dark-400">
          Access your private market concierge
        </h2>
      </header>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(handleSignIn)} className="space-y-5">
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
          <InputField
            labelText="Password"
            type="password"
            placeholder="••••••••"
            feedbackType={errors.password?.message ? 'error' : 'none'}
            feedback={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between mt-6 gap-x-6">
            <Link
              href="/auth/forgot-password"
              className="body-small-semibold text-primary-700 dark:text-gray-dark-300 hover:text-primary-800 dark:hover:text-gray-dark-100"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            label="Sign in"
            disabled={isSubmitting || !email || !password}
            loading={isSubmitting}
          />
        </Form>
      </FormProvider>
    </Container>
  );
}
