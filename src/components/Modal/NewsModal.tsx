import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Close } from '../Icons/Close';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import { HiOutlineNewspaper } from 'react-icons/hi';
import Link from 'next/link';

// Define the GraphQL mutation
const FETCH_EXTERNAL_CONTENT = gql`
  mutation FetchExternalContent($url: String!) {
    fetchExternalContent(url: $url)
  }
`;

interface NewsModalProps {
  open: boolean;
  onClose(): void;
  contentUrl: string;
}

export function NewsModal({ open, onClose, contentUrl }: NewsModalProps) {
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [content, setContent] = useState<string>('');
  const [fetchContent, { loading, error }] = useMutation(
    FETCH_EXTERNAL_CONTENT
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onClose]);

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
    if (open && contentUrl) {
      fetchContent({ variables: { url: contentUrl } })
        .then((response) => {
          setContent(response.data.fetchExternalContent);
        })
        .catch((error) => {
          const hasForbiddenError = error.graphQLErrors?.some(
            (e: { message: string }) => e.message === 'Forbidden'
          );
          if (hasForbiddenError) {
            onClose();
            window.open(contentUrl, '_blank');
          } else {
            console.error('Error fetching content:', error);
            setContent('Error loading content');
          }
        });
    }
  }, [open, contentUrl, fetchContent, onClose]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching content. Please try again later.</p>;

  return (
    <div className="flex justify-center items-center fixed inset-0 z-[999] pr-10 animate-fadeIn">
      <div
        className={classNames(
          { 'max-w-4xl': !fullscreenPreview },
          { 'max-w-[95vw]': fullscreenPreview },
          'bg-primary-600 w-full h-full z-[999] relative mb-6 rounded-md px-2'
        )}
      >
        <div
          className={classNames(
            {
              'max-w-4xl': !fullscreenPreview,
            },
            'rounded-xl w-full mx-auto z-[999] relative py-2 h-full'
          )}
        >
          <button
            className={classNames(
              !fullscreenPreview ? 'lg:-right-12 -right-9' : 'lg:-right-10',
              'absolute top-4 z-10 hover:scale-125'
            )}
            onClick={onClose}
          >
            <Close
              width={16}
              height={16}
              className="stroke-gray-light-200 dark:stroke-gray-dark-300"
            />
          </button>
          <button
            className={classNames(
              !fullscreenPreview ? 'lg:-right-[52px]' : 'lg:-right-[45px]',
              'absolute top-12 z-10 hover:scale-125 hidden lg:block'
            )}
            onClick={() => setFullscreenPreview(!fullscreenPreview)}
          >
            {fullscreenPreview ? (
              <AiOutlineFullscreenExit className="text-gray-light-200 dark:text-gray-dark-300 w-6 h-6" />
            ) : (
              <AiOutlineFullscreen className="text-gray-light-200 dark:text-gray-dark-300 w-6 h-6" />
            )}
          </button>
          <Link
            href={contentUrl}
            className={classNames(
              !fullscreenPreview
                ? 'lg:-right-[52px] -right-10'
                : 'lg:-right-[45px]',
              'absolute top-12 lg:top-[84px] z-10 hover:scale-125'
            )}
            target="_blank"
            rel="noreferrer"
          >
            <HiOutlineNewspaper className="text-gray-light-200 dark:text-gray-dark-300 w-6 h-6" />
          </Link>

          {/* <div className="w-full h-full rounded-md bg-white" dangerouslySetInnerHTML={{ __html: content }} /> */}
          <iframe
            srcDoc={`<base href="${contentUrl}" target="_blank">${content}`}
            className="w-full h-full rounded-md bg-white"
            loading="lazy"
          />
        </div>
      </div>

      <div
        className="fixed inset-0 bg-gray-light-950/70 dark:bg-gray-dark-800/70 backdrop-blur-sm"
        onClick={onClose}
      />
    </div>
  );
}
