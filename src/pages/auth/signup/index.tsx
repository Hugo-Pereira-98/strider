import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';
import { openDB, addUser, getUsers } from '@/utils/indexedDB';
import { Container } from '@/components/ui/Container';
import { Form } from '@/components/ui/Form';
import InputField from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CheckBox from '@/components/ui/Form/CheckBox';
import Link from 'next/link';
import { HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi2';
import classNames from 'classnames';
import { useToast } from '@/hooks/useToast';
import { FeaturedIcon } from '@/components/FeaturedIcon';
import { Atom } from '@/components/Icons/Atom';
import Head from 'next/head';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      'Must contain one special character'
    ),
  first_name: z
    .string()
    .min(1, 'First name required')
    .regex(
      /^[A-Za-z\s]+$/,
      'First name should not contain numbers or special characters'
    ),
  last_name: z
    .string()
    .min(1, 'Last name required')
    .regex(
      /^[A-Za-z\s]+$/,
      'Last name should not contain numbers or special characters'
    ),
  acceptTerms: z.boolean().default(false),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const methods = useForm<SignUpForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      acceptTerms: false,
    },
    resolver: zodResolver(signUpSchema),
  });

  const { setValue } = methods;
  const { toast } = useToast();
  const [checkedToS, setCheckedToS] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const email = watch('email');
  const password = watch('password');
  const first_name = watch('first_name');
  const last_name = watch('last_name');
  const acceptTerms = watch('acceptTerms');

  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  useEffect(() => {
    const formValuesFilled = Boolean(
      email && password && first_name && last_name && acceptTerms
    );
    const noErrors = Object.keys(errors).length === 0;

    setAllFieldsFilled(formValuesFilled && noErrors);
  }, [email, password, first_name, last_name, acceptTerms, errors]);

  const handleSignUp = async (values: SignUpForm) => {
    try {
      const db = await openDB();

      const users = await getUsers(db);

      const existingUser = users.find(
        (user: any) => user.email === values.email
      );
      if (existingUser) {
        toast({
          title: 'Error creating account',
          description: 'User already exists',
        });
        return;
      }

      const newUser = {
        email: values.email,
        firstName: values.first_name,
        lastName: values.last_name,
        password: Buffer.from(values.password).toString('base64'),
        themePreference: 'system',
      };

      await addUser(db, newUser);

      toast({
        title: 'Account created successfully',
      });

      router.push('/feed');
    } catch (err: any) {
      toast({
        title: 'Error creating account',
        description: err.message,
      });
      console.error('Error creating account:', err);
    }
  };

  const getErrorMessage = () => {
    if (errors.first_name?.message && errors.last_name?.message) {
      return 'First and last name required';
    } else if (errors.first_name?.message) {
      return errors.first_name.message;
    } else if (errors.last_name?.message) {
      return errors.last_name.message;
    }
    return '';
  };

  return (
    <Container className="max-w-xl space-y-8 pt-12 md:pt-24 bg-[url(/assets/auth-bg-pattern.svg)] dark:bg-[url(/assets/auth-bg-pattern-dark.svg)] bg-[center_top] bg-no-repeat">
      <Head>
        <title>Gondola | Sign up</title>
      </Head>

      <header className="flex flex-col items-center">
        <FeaturedIcon>
          <Atom className="fill-gray-light-700 dark:fill-gray-dark-300" />
        </FeaturedIcon>
        <h1 className="heading-extra-small-semibold md:heading-small-semibold text-gray-light-950 dark:text-gray-dark-50 mb-3 mt-6">
          Create an account
        </h1>
        <h2 className="body-medium-regular text-gray-light-600 dark:text-gray-dark-400">
          Welcome to Gondola
        </h2>
      </header>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
          <div className="flex items-end">
            <InputField
              labelText="Name"
              placeholder="First Name"
              corners="sharpRight"
              feedbackType={
                errors.first_name?.message || errors.last_name?.message
                  ? 'error'
                  : 'none'
              }
              {...register('first_name')}
            />
            <InputField
              placeholder="Last Name"
              corners="sharpLeft"
              feedbackType={
                errors.first_name?.message || errors.last_name?.message
                  ? 'error'
                  : 'none'
              }
              {...register('last_name')}
            />
          </div>
          <div className="flex">
            <p className="text-error-600 dark:text-error-400 body-small-regular mt-[-16px]">
              {getErrorMessage()}
            </p>
          </div>
          <InputField
            labelText="Email"
            placeholder="Enter your email"
            feedbackType={errors.email?.message ? 'error' : 'none'}
            feedback={errors.email?.message}
            trailIcon={
              errors.email?.message && (
                <HiOutlineExclamationCircle className="text-base text-error-500" />
              )
            }
            {...register('email')}
          />
          <InputField
            labelText="Password"
            type="password"
            placeholder="Create a password"
            feedbackType={errors.password?.message ? 'error' : 'none'}
            feedback={errors.password?.message}
            {...register('password')}
          />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={classNames(
                  password.length >= 8
                    ? 'bg-primary-600'
                    : 'bg-gray-light-300 dark:bg-gray-dark-600',
                  'w-5 h-5 rounded-full flex items-center justify-center'
                )}
              >
                <HiCheck className="text-white pointer-events-none stroke-2 text-xs" />
              </div>
              <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
                Must be at least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={classNames(
                  /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)
                    ? 'bg-primary-600'
                    : 'bg-gray-light-300 dark:bg-gray-dark-600',
                  'w-5 h-5 rounded-full flex items-center justify-center'
                )}
              >
                <HiCheck className="text-white pointer-events-none stroke-2 text-xs" />
              </div>
              <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
                Must contain one special character
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={classNames(
                  /[A-Z]/.test(password)
                    ? 'bg-primary-600'
                    : 'bg-gray-light-300 dark:bg-gray-dark-600',
                  'w-5 h-5 rounded-full flex items-center justify-center'
                )}
              >
                <HiCheck className="text-white pointer-events-none stroke-2 text-xs" />
              </div>
              <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
                Must contain at least one uppercase letter
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckBox {...register('acceptTerms')} />
            <label
              htmlFor="acceptTerms"
              className="body-small-regular text-gray-light-700 dark:text-gray-dark-300"
            >
              I agree to the{' '}
              <Link
                className="underline"
                href="https://www.gondolamarkets.com/legal/terms"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                className="underline"
                href="https://www.gondolamarkets.com/legal/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <Button
            type="submit"
            label="Get started"
            disabled={!allFieldsFilled}
          />
        </Form>
      </FormProvider>

      <footer className="text-center">
        <span className="body-small-regular text-gray-light-600 dark:text-gray-dark-400">
          Already have an account?
        </span>{' '}
        <Link
          href="/auth/signin"
          className="body-small-semibold text-primary-700 dark:text-gray-dark-300 hover:text-primary-800 dark:hover:text-gray-dark-100"
        >
          Log in
        </Link>
      </footer>
    </Container>
  );
}
