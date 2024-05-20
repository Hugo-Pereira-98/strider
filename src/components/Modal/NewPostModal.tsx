import { useToast } from '@/hooks/useToast';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Close } from '../Icons/Close';
import Button from '../Button';
import { Form } from '../ui/Form';
import InputField from '../ui/Input';

interface PostModalProps {
  open: boolean;
  onClose(): void;
  userId: number;
}

export function PostModal({ open, onClose, userId }: PostModalProps) {
  const { toast } = useToast();
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const methods = useForm({
    defaultValues: {
      content: '',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleCreatePost = (data: { content: string }) => {
    console.log(
      `User ID: ${userId}, Content: ${data.content}, Tagged: ${taggedUsers}`
    );
    toast({
      title: 'Post Created',
      description: 'Your post has been created successfully.',
    });
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

  return (
    <div
      className={`flex justify-center items-center fixed inset-0 z-40 px-4 ${
        open ? 'block' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-gray-dark-950 rounded-xl p-6 max-w-[640px] w-full z-40 relative">
        <button className="absolute right-6 z-10" onClick={onClose}>
          <Close />
        </button>

        <div className="relative pb-5">
          <p className="body-large-semibold text-gray-light-950 dark:text-gray-dark-50">
            Create a Post
          </p>
          <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 max-w-lg">
            Share your thoughts with your followers.
          </p>
        </div>

        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(handleCreatePost)} className="mt-8">
            <div className="space-y-4 my-10">
              <InputField
                labelText="Post Content"
                placeholder="What's on your mind?"
                feedbackType={errors.content?.message ? 'error' : 'none'}
                feedback={errors.content?.message}
                {...register('content', { required: 'Content is required' })}
              />
              <InputField
                labelText="Tag Users"
                placeholder="Tag users (comma-separated)"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {taggedUsers.map((user, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-light-200 dark:bg-gray-dark-700 rounded-md"
                >
                  {user}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Button
                label="Cancel"
                buttonType="secondaryGray"
                onClick={onClose}
              />
              <Button type="submit" label="Submit" />
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
