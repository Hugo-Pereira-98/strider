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
import PostCard from '@/components/PostCard';
import { PostModal } from '../../components/Modal/NewPostModal';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
        const newPosts = await getAllPosts(db, offset, limit, searchTerm);
        setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else if (feedType === 'following' && session) {
        const newPosts = await getPostsFromFollowedUsers(
          db,
          session.email,
          offset,
          limit,
          searchTerm
        );
        setFollowingPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
    };

    fetchData();
  }, [feedType, session, offset, searchTerm]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOffset(0);
    if (feedType === 'all') {
      setAllPosts([]);
    } else {
      setFollowingPosts([]);
    }
  };

  return (
    <UserLayout sessions={sessions}>
      <div className="p-4">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-dark-950 flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 focus:outline-none ${
                feedType === 'all'
                  ? 'border-b-2 border-primary-600'
                  : 'text-gray-light-600 dark:text-gray-dark-400'
              }`}
              onClick={() => handleToggle('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 focus:outline-none ${
                feedType === 'following'
                  ? 'border-b-2 border-primary-600'
                  : 'text-gray-light-600 dark:text-gray-dark-400'
              }`}
              onClick={() => handleToggle('following')}
            >
              Following
            </button>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search posts"
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 border focus:outline-gray-light-25 focus:dark:outline-gray-dark-900 border-gray-light-300 dark:border-gray-dark-700 bg-gray-light-25 dark:bg-gray-dark-800 rounded-md"
            />
            <button
              className="px-4 py-2 focus:outline-primary-500 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              onClick={toggleModal}
            >
              Post
            </button>
          </div>
        </div>
        <div className="overflow-y-auto scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-96 scrollbar-w-2">
          {(feedType === 'all' ? allPosts : followingPosts).map(
            ({ post, user }) => (
              <PostCard
                key={post?.id}
                post={post}
                user={user}
                sessionUserId={session.userId}
                sessionUserName={session.userName}
                sessionUserEmail={session.email}
              />
            )
          )}
        </div>
        <div ref={loaderRef} className="loading" />
      </div>

      {isModalOpen && (
        <PostModal open={isModalOpen} userId={21} onClose={toggleModal} />
      )}
    </UserLayout>
  );
}
