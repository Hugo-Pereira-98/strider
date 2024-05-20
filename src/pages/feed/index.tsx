import { HomeLine } from '@/components/Icons/HomeLine';
import { useSession } from '@/hooks/useSession';
import { UserLayout } from '@/layouts/UserLayout';
import {
  getAllPosts,
  getPostsFromFollowedUsers,
  openDB,
} from '@/utils/indexedDB';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { Post, User } from '@/utils/interfaces';
import PostCard from '@/components/PostCard'; // Adjust the import path if necessary

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

export default function Feed() {
  const { session } = useSession();
  const router = useRouter();
  const [feedType, setFeedType] = useState('all');
  const [allPosts, setAllPosts] = useState<{ post: Post; user: User }[]>([]);
  const [followingPosts, setFollowingPosts] = useState<
    { post: Post; user: User }[]
  >([]);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const loaderRef = useRef<HTMLDivElement>(null);

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
        const newPosts = await getAllPosts(db, offset, limit);
        setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else if (feedType === 'following' && session) {
        const newPosts = await getPostsFromFollowedUsers(
          db,
          session.email,
          offset,
          limit
        );
        setFollowingPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
    };

    fetchData();
  }, [feedType, session, offset]);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setOffset((prevOffset) => prevOffset + limit);
      }
    };

    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  const handleToggle = (type: string) => {
    setFeedType(type);
    setOffset(0);
    if (type === 'all') {
      setAllPosts([]);
    } else {
      setFollowingPosts([]);
    }
    router.push(`/feed?feed=${type}`);
  };

  return (
    <UserLayout sessions={sessions}>
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
        <div className="overflow-y-auto scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-96 scrollbar-w-2">
          {(feedType === 'all' ? allPosts : followingPosts).map(
            ({ post, user }) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                sessionUserId={21}
              />
            )
          )}
        </div>
        <div ref={loaderRef} className="loading" />
      </div>
    </UserLayout>
  );
}
