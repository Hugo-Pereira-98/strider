import { HomeLine } from '@/components/Icons/HomeLine';
import { useSession } from '@/hooks/useSession';
import { InstitutionalLayout } from '@/layouts/InstitutionalLayout';
import {
  getAllPosts,
  getPostsFromFollowedUsers,
  openDB,
} from '@/utils/indexedDB';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { Post, User } from '@/utils/interfaces';
import { FaRetweet, FaHeart, FaComment } from 'react-icons/fa';
import Badge from '../../components/ui/Badge';

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

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
      : '';
  };

  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>(
    {}
  );
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    postId: number
  ) => {
    const { value } = e.target;
    if (value.length <= 100) {
      setCommentTexts((prev) => ({ ...prev, [postId]: value }));
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setCommentTexts((prev) => ({ ...prev, [postId]: '' })); // Clear comment text on toggle
  };

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
        <div className="overflow-y-auto scrollbar scrollbar-thumb-gray-light-200 dark:scrollbar-thumb-gray-dark-700 scrollbar-thumb-rounded-full scrollbar-h-96 scrollbar-w-2">
          {(feedType === 'all' ? allPosts : followingPosts).map(
            ({ post, user }) => (
              <div
                key={post?.id}
                className="animate-fadeIn p-3 pb-0 rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 transition-colors mb-4"
              >
                <div className="flex items-center mb-2">
                  <div className="rounded-full h-8 w-8 border border-gray-light-400 dark:border-gray-dark-800 flex items-center justify-center relative">
                    <div className="bg-success-500 rounded-full h-[10px] w-[10px] absolute right-1 bottom-1 transform translate-y-1/2 translate-x-1/2" />
                    <span className="body-small-semiBold text-gray-light-500 dark:text-gray-dark-400">
                      {getInitials(user.userName)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-light-900 dark:text-white">
                        {user.userName}
                      </span>
                      <span className="text-gray-light-500 dark:text-gray-dark-400">
                        @{user.email.split('@')[0]}
                      </span>
                    </div>
                    <span className="text-gray-light-400 dark:text-gray-dark-500 text-sm">
                      {format(new Date(post?.postDate), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-light-900 dark:text-white mb-3">
                  {post?.post}
                </p>
                <div className="flex space-x-4 text-gray-light-500 dark:text-gray-dark-400 text-sm mb-2">
                  <span className="flex items-center space-x-1 hover:text-green-600 transition-colors cursor-pointer">
                    <FaRetweet />
                    <span>{post?.retweets.length}</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:text-red-600 transition-colors cursor-pointer">
                    <FaHeart />
                    <span>{post?.likes.length}</span>
                  </span>
                  <span
                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => toggleComments(post.id!)}
                  >
                    <FaComment />
                    <span>{post?.comments.length}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post?.tagged.map((taggedUser) => (
                    <Badge
                      key={taggedUser.userId}
                      label={taggedUser.userName}
                    />
                  ))}
                </div>
                {showComments[post.id!] && (
                  <div>
                    <div className="mt-2 flex items-start space-x-2 py-3 border-t border-gray-light-200 dark:border-gray-dark-800">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentTexts[post.id!] || ''}
                        onChange={(e) => handleCommentChange(e, post.id!)}
                        maxLength={100}
                        className="w-full p-2 border border-gray-light-300 dark:border-gray-dark-700 bg-gray-light-25 dark:bg-gray-dark-900 rounded-md focus:outline-none focus:border-primary-600 dark:focus:border-primary-500"
                      />
                      <button
                        className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${
                          commentTexts[post.id!]?.trim()
                            ? 'visible'
                            : 'invisible'
                        }`}
                      >
                        Comment
                      </button>
                    </div>
                    <div>
                      {post?.comments.map((comment) => (
                        <div key={comment.id}>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-light-900 dark:text-white">
                              {comment.userName}
                            </span>
                            <span className="text-gray-light-500 dark:text-gray-dark-400">
                              @{comment.email.split('@')[0]}
                            </span>
                            <span className="text-gray-light-400 dark:text-gray-dark-500 text-sm">
                              {format(
                                new Date(comment.commentDate),
                                'MMMM dd, yyyy'
                              )}
                            </span>
                          </div>
                          <p className="text-gray-light-900 dark:text-white">
                            {comment.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-b border-gray-light-200 dark:border-gray-dark-800 pb-3 h-2 w-full" />
              </div>
            )
          )}
        </div>
        <div ref={loaderRef} className="loading" />
      </div>
    </InstitutionalLayout>
  );
}
