import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/router';
import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import { HomeLine } from '@/components/Icons/HomeLine';
import {
  openDB,
  getAllPosts,
  getPostsFromFollowedUsers,
} from '@/utils/indexedDB';

const sessions = [
  {
    text: '',
    icon: (
      <HomeLine className="stroke-gray-light-500 dark:stroke-gray-dark-400" />
    ),
  },
  {
    text: 'Feed',
  },
];

const posts = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      handle: '@johndoe',
      avatar: '/path/to/avatar.jpg',
    },
    content: 'Just had the best coffee ever!',
    timestamp: '2h',
    replies: 10,
    retweets: 5,
    likes: 20,
  },
];

export default function Feed() {
  const { session } = useSession();
  const router = useRouter();
  const [feedType, setFeedType] = useState('all');

  useEffect(() => {
    const { feed } = router.query;
    if (feed === 'following') {
      setFeedType('following');
    } else {
      setFeedType('all');
    }
  }, [router.query]);

  useEffect(() => {
    const fetchData = async () => {
      const db = await openDB();

      if (feedType === 'all') {
        const allPosts = await getAllPosts(db);
        console.log('All posts:', allPosts);
      } else if (feedType === 'following' && session) {
        const followedPosts = await getPostsFromFollowedUsers(
          db,
          session.email
        );
        console.log('Followed users posts:', followedPosts);
      }
    };

    fetchData();
  }, [feedType, session]);

  useEffect(() => {
    const { feed } = router.query;
    if (feed === 'following') {
      setFeedType('following');
    } else {
      setFeedType('all');
    }
  }, [router.query]);

  const handleToggle = (type: string) => {
    setFeedType(type);
    router.push(`/feed?feed=${type}`);
  };

  console.log('session', session);

  return (
    <InstitutionalLayout sessions={sessions}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 ${
                feedType === 'all'
                  ? 'font-bold border-b-2 border-primary-600'
                  : 'text-gray-light-600 dark:text-gray-dark-400'
              }`}
              onClick={() => handleToggle('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 ${
                feedType === 'following'
                  ? 'font-bold border-b-2 border-primary-600'
                  : 'text-gray-light-600 dark:text-gray-dark-400'
              }`}
              onClick={() => handleToggle('following')}
            >
              Following
            </button>
          </div>
        </div>
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-b border-gray-light-200 dark:border-gray-dark-800 p-4"
            >
              <div className="flex items-center mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-light-900 dark:text-white">
                      {post.user.name}
                    </span>
                    <span className="text-gray-light-500 dark:text-gray-dark-400">
                      {post.user.handle}
                    </span>
                  </div>
                  <span className="text-gray-light-400 dark:text-gray-dark-500 text-sm">
                    {post.timestamp}
                  </span>
                </div>
              </div>
              <p className="text-gray-light-900 dark:text-white mb-3">
                {post.content}
              </p>
              <div className="flex space-x-4 text-gray-light-500 dark:text-gray-dark-400 text-sm">
                <span>{post.replies} Replies</span>
                <span>{post.retweets} Retweets</span>
                <span>{post.likes} Likes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InstitutionalLayout>
  );
}
