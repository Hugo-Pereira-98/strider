import { useRouter } from 'next/router';
import { useSession } from '@/hooks/useSession';
import { UserLayout } from '@/layouts/UserLayout';
import {
  getAllPosts,
  getPostsFromFollowedUsers,
  getUsers,
  openDB,
} from '@/utils/indexedDB';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Post, User } from '@/utils/interfaces';
import PostCard from '@/components/PostCard';
import { PostModal } from '@/components/Modal/PostModal';
import { HomeLine } from '@/components/Icons/HomeLine';
import { UserProfileModal } from '@/components/Modal/UserProfileModal';
import UserCard from '@/components/UserCard';

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
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openUserProfile = useCallback(
    (userId: number) => {
      setSelectedUserId(userId);
      setIsUserProfileModalOpen(true);
      router.push(`/feed?userId=${userId}`, undefined, { shallow: true });
    },
    [router]
  );

  const closeUserProfileModal = useCallback(() => {
    setIsUserProfileModalOpen(false);
    setSelectedUserId(null);
    router.push('/feed', undefined, { shallow: true });
  }, [router]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchData = useCallback(async () => {
    const db = await openDB();
    if (feedType === 'all') {
      const newPosts = await getAllPosts(db, offset, limit, searchTerm);
      console.log('newPosts', newPosts);
      setAllPosts((prevPosts) => {
        const mergedPosts = [...prevPosts, ...newPosts];
        const uniquePosts = mergedPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.post.id === post.post.id)
        );
        return uniquePosts;
      });
    } else if (feedType === 'following' && session) {
      const newPosts = await getPostsFromFollowedUsers(
        db,
        session.email,
        offset,
        limit,
        searchTerm
      );
      setFollowingPosts((prevPosts) => {
        const mergedPosts = [...prevPosts, ...newPosts];
        const uniquePosts = mergedPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.post.id === post.post.id)
        );
        return uniquePosts;
      });
    } else if (feedType === 'discover') {
      const newUsers = await getUsers(db);
      setAllUsers(newUsers);
    }
  }, [feedType, offset, limit, searchTerm, session]);

  useEffect(() => {
    const { feed, userId } = router.query;
    if (feed === 'following') {
      setFeedType('following');
    } else if (feed === 'discover') {
      setFeedType('discover');
    } else {
      setFeedType('all');
    }
    if (userId) {
      openUserProfile(Number(userId));
    } else {
      setOffset(0); // Reset offset when the query changes
      setAllPosts([]);
      setFollowingPosts([]);
      fetchData();
    }
  }, [router.query, session, openUserProfile, fetchData]);

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
    } else if (type === 'following') {
      setFollowingPosts([]);
    } else if (type === 'discover') {
      setAllUsers([]);
    }
    router.push(`/feed?feed=${type}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOffset(0);
    if (feedType === 'all') {
      setAllPosts([]);
    } else if (feedType === 'following') {
      setFollowingPosts([]);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setOffset(0);
      setAllPosts([]);
      setFollowingPosts([]);
      fetchData();
    }
  }, [isModalOpen, fetchData]);

  return (
    <UserLayout>
      <div className="p-4">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-dark-950 flex flex-col md:flex-row justify-between items-center py-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 focus:outline-none ${
                feedType === 'all'
                  ? 'border-b-2 border-primary-600'
                  : 'border-b-2 border-transparent text-gray-light-600 dark:text-gray-dark-400'
              }`}
              onClick={() => handleToggle('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 focus:outline-none ${
                feedType === 'following'
                  ? 'border-b-2 border-primary-600'
                  : 'border-b-2 border-transparent text-gray-light-600 dark:text-gray-dark-400'
              }`}
              onClick={() => handleToggle('following')}
            >
              Following
            </button>
            <button
              className={`px-4 py-2 focus:outline-none ${
                feedType === 'discover'
                  ? 'border-b-2 border-primary-600'
                  : 'border-b-2 border-transparent text-gray-light-600 dark:text-gray-dark-400'
              }`}
              onClick={() => handleToggle('discover')}
            >
              Discover
            </button>
          </div>
          {feedType !== 'discover' && (
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search posts"
                value={searchTerm}
                onChange={handleSearch}
                className="p-2 border w-full md:w-auto focus:outline-gray-light-25 focus:dark:outline-gray-dark-900 border-gray-light-300 dark:border-gray-dark-700 bg-gray-light-25 dark:bg-gray-dark-800 rounded-md"
              />
              <button
                className="px-4 py-2 focus:outline-primary-500 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors w-full md:w-auto"
                onClick={toggleModal}
              >
                Post
              </button>
            </div>
          )}
        </div>
        {feedType === 'discover' ? (
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-4 justify-center">
              {allUsers.length > 0 ? (
                allUsers.map((user) => (
                  <UserCard
                    key={user.userId}
                    user={user}
                    onClick={openUserProfile}
                  />
                ))
              ) : (
                <p>No users yet...</p>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-96 scrollbar-w-2">
            {(feedType === 'all' ? allPosts : followingPosts).length > 0 ? (
              (feedType === 'all' ? allPosts : followingPosts).map(
                ({ post, user }) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    user={user}
                    sessionUserId={session.userId}
                    sessionUserName={session.userName}
                    sessionUserEmail={session.email}
                    onPostCreated={() => {
                      setOffset(0);
                      setAllPosts([]);
                      setFollowingPosts([]);
                      fetchData();
                    }}
                  />
                )
              )
            ) : (
              <p>No posts yet...</p>
            )}
          </div>
        )}
        <div ref={loaderRef} className="loading" />
      </div>
      {selectedUserId !== null && (
        <UserProfileModal
          open={isUserProfileModalOpen}
          onClose={closeUserProfileModal}
          userId={selectedUserId}
          sessionUserId={21}
          sessionUserName="currentUserUserName"
          sessionUserEmail="currentUserEmail"
        />
      )}
      {isModalOpen && (
        <PostModal
          open={isModalOpen}
          userId={session.userId}
          onClose={toggleModal}
          onPostCreated={() => {
            setOffset(0);
            setAllPosts([]);
            setFollowingPosts([]);
            fetchData();
          }}
        />
      )}
    </UserLayout>
  );
}
