import Button from '@/components/Button';
import { FeaturedIcon } from '@/components/FeaturedIcon';
import { Container } from '@/components/ui/Container';
import { Form } from '@/components/ui/Form';
import InputField from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { createUser, getUsers, openDB } from '@/utils/indexedDB';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { FaTwitter } from 'react-icons/fa';
import { HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi2';
import z from 'zod';

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
  userName: z
    .string()
    .min(1, 'Username required')
    .max(14, 'Maximum 14 characters')
    .regex(
      /^[A-Za-z0-9]+$/,
      'Username should contain only alphanumeric characters'
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
      userName: '',
      acceptTerms: false,
    },
    resolver: zodResolver(signUpSchema),
  });

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = methods;

  const password = watch('password');

  const handleSignUp = async (values: SignUpForm) => {
    try {
      const db = await openDB();

      const users = await getUsers(db);

      const existingUser = users.find(
        (user: any) => user.email === values.email.toLowerCase()
      );
      if (existingUser) {
        toast({
          title: 'Error creating account',
          description: 'User already exists',
        });
        return;
      }

      const createdUser = await createUser(
        db,
        values.userName,
        values.email.toLowerCase(),
        values.password
      );

      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email.toLowerCase(),
          password: values.password,
          userName: values.userName,
          userId: createdUser.userId,
        }),
      });

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

  return (
    <Container className="max-w-xl space-y-8 pt-12 md:pt-24 bg-[url(/assets/auth-bg-pattern.svg)] dark:bg-[url(/assets/auth-bg-pattern-dark.svg)] bg-[center_top] bg-no-repeat">
      <Head>
        <title>Posterr | Sign up</title>
      </Head>

      <header className="flex flex-col items-center">
        <FeaturedIcon>
          <FaTwitter
            size={32}
            className="fill-primary-500 dark:fill-primary-600"
          />
        </FeaturedIcon>
        <h1 className="heading-extra-small-semibold md:heading-small-semibold text-gray-light-950 dark:text-gray-dark-50 mb-3 mt-6">
          Create an account
        </h1>
        <h2 className="body-medium-regular text-gray-light-600 dark:text-gray-dark-400">
          Welcome to Posterr
        </h2>
      </header>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
          <InputField
            labelText="Username"
            placeholder="Enter your username"
            feedbackType={errors.userName?.message ? 'error' : 'none'}
            feedback={errors.userName?.message}
            trailIcon={
              errors.userName?.message && (
                <HiOutlineExclamationCircle className="text-base text-error-500" />
              )
            }
            {...register('userName')}
          />
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
          <Button type="submit" label="Get started" disabled={!isValid} />
        </Form>
      </FormProvider>
    </Container>
  );
}
