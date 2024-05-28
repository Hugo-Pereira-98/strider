import { useToast } from '@/hooks/useToast';
import { createPost, openDB } from '@/utils/indexedDB';
import { RetweetFrom, User } from '@/utils/interfaces';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '../Button';
import { Close } from '../Icons/Close';
import Textarea from '../Textarea';
import { Form } from '../ui/Form';

interface PostModalProps {
  open: boolean;
  onClose(): void;
  userId: number;
  retweetFrom?: RetweetFrom;
  onPostCreated?: () => void;
}

export function PostModal({
  open,
  onClose,
  userId,
  retweetFrom,
  onPostCreated,
}: PostModalProps) {
  const { toast } = useToast();
  const [taggedUsers, setTaggedUsers] = useState<
    Pick<User, 'userId' | 'userName' | 'email'>[]
  >([]);
  const [isTagging, setIsTagging] = useState(false);
  const [content, setContent] = useState('');
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

  const handleCreatePost = async (data: { content: string }) => {
    if (isTagging) {
      return;
    }

    const db = await openDB();
    try {
      const postContent = retweetFrom && !data.content ? '' : data.content;
      const newPost = await createPost(
        db,
        userId,
        postContent,
        taggedUsers,
        retweetFrom || null
      );

      toast({
        title: 'Post Created',
        description: 'Your post has been created successfully.',
      });
      onClose();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
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

  const canSubmit = !isTagging && (retweetFrom || content.length > 0);
  const charsRemaining = 777 - content.length;

  const handleContentChange = (newContent: string) => {
    if (newContent.length <= 777) {
      setValue('content', newContent);
      setContent(newContent);
    }
  };

  return (
    <div
      className={`flex justify-center items-center fixed inset-0 z-[500] px-4 ${
        open ? 'block' : 'hidden'
      }`}
    >
      <div className="bg-white dark:bg-gray-dark-950 rounded-xl p-6 max-w-[640px] w-full z-40 relative">
        <button className="absolute right-6 z-10" onClick={onClose}>
          <Close />
        </button>

        <div className="relative">
          <p className="body-large-semibold text-gray-light-950 dark:text-gray-dark-50">
            Create a Post
          </p>
          <p className="body-small-regular text-gray-light-600 dark:text-gray-dark-400 max-w-lg">
            Share your thoughts with your followers.
          </p>
        </div>

        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(handleCreatePost)} className="mt-8">
            <div className="my-6">
              <Textarea
                style={{
                  height: '140px',
                  resize: `none`,
                }}
                maxLength={777}
                labelText="Post Content"
                placeholder="What's on your mind?"
                feedbackType={errors.content?.message ? 'error' : 'none'}
                feedback={errors.content?.message}
                {...register('content')}
                onTaggedUsersChange={setTaggedUsers}
                onContentChange={handleContentChange}
                setIsTagging={setIsTagging}
              />
              <div className="text-right text-sm text-gray-light-600 dark:text-gray-dark-400">
                {charsRemaining} characters remaining
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {taggedUsers.map((user, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-light-200 dark:bg-gray-dark-700 rounded-md"
                >
                  {user.userName}
                </span>
              ))}
            </div>

            {retweetFrom && (
              <div className="bg-gray-light-100 dark:bg-gray-dark-900 p-3 rounded-md mb-3">
                <div className="flex items-center mb-2">
                  <div className="rounded-full h-8 w-8 border border-gray-light-400 dark:border-gray-dark-800 flex items-center justify-center relative">
                    <span className="body-small-semiBold text-gray-light-500 dark:text-gray-dark-400">
                      {retweetFrom.userName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-light-900 dark:text-white">
                        {retweetFrom.userName}
                      </span>
                      <span className="text-gray-light-500 dark:text-gray-dark-400">
                        @{retweetFrom.email.split('@')[0]}
                      </span>
                    </div>
                    <span className="text-gray-light-400 dark:text-gray-dark-500 text-sm">
                      {format(new Date(retweetFrom.postDate), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-light-900 dark:text-white mb-3">
                  {retweetFrom.post}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 mt-5">
              <Button
                label="Cancel"
                buttonType="secondaryGray"
                onClick={onClose}
              />
              <Button type="submit" label="Submit" disabled={!canSubmit} />
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
