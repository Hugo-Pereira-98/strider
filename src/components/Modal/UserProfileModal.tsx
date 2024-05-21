import { Close } from '@/components/Icons/Close';
import PostCard from '@/components/PostCard';
import Badge from '@/components/ui/Badge';
import {
  followUser,
  getUserById,
  getUserProfile,
  openDB,
} from '@/utils/indexedDB';
import { Post, User } from '@/utils/interfaces';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../Button';
import { PostModal } from '@/components/Modal/PostModal';

interface UserProfileModalProps {
  open: boolean;
  onClose(): void;
  userId: number;
  sessionUserId: number;
  sessionUserName: string;
  sessionUserEmail: string;
}

export function UserProfileModal({
  open,
  onClose,
  userId,
  sessionUserId,
  sessionUserName,
  sessionUserEmail,
}: UserProfileModalProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const db = await openDB();
        const { user, posts } = await getUserProfile(db, Number(userId));
        setUser(user);
        setPosts(posts);
        const sessionUser = await getUserById(db, sessionUserId);
        const following = sessionUser.following.some(
          (followingUser) => followingUser.userId === user.userId
        );
        setIsFollowing(following);
      };
      fetchData();
    }
  }, [userId, sessionUserId]);

  const handleFollowToggle = async () => {
    if (!user) return;
    const db = await openDB();
    await followUser(db, sessionUserId, user.userId);
    setIsFollowing(!isFollowing);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleClose = () => {
    onClose();
    router.push('/feed?feed=discover', undefined, { shallow: true });
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
      window.addEventListener('keydown', handleKeyPress);
    } else {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleKeyPress);
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[500] flex items-center justify-center px-4 ${
        open ? 'block' : 'hidden'
      }`}
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleClose}
      />
      <div className="animate-fadeIn bg-white dark:bg-gray-dark-950 rounded-xl p-6 max-w-[640px] w-full z-40 relative overflow-y-auto min-h-[75vh] max-h-[75vh]">
        <button className="absolute right-6 top-6 z-10" onClick={handleClose}>
          <Close />
        </button>
        <div className="relative">
          {user && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {user.userName}
                </h3>
                <div className="mt-2 flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined {format(new Date(user.dateJoined), 'MMMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.followers.length} Followers • {user.following.length}{' '}
                    Following
                  </p>
                  <div className="flex items-center justify-center my-4 gap-4">
                    <div className="w-min">
                      <Badge label={`Posts: ${posts.length}`} />
                    </div>
                    <div
                      onClick={handleFollowToggle}
                      className="cursor-pointer"
                    >
                      {sessionUserId !== user.userId && (
                        <Badge
                          color={isFollowing ? 'secondary' : 'primary'}
                          label={isFollowing ? 'Unfollow' : 'Follow'}
                        />
                      )}
                    </div>
                  </div>
                  <div className="w-36">
                    <Button label="Post for user" onClick={toggleModal} />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="grid gap-4">
            {user &&
              posts.map((post) => (
                <PostCard
                  hideFollowButton
                  key={post.id}
                  post={post}
                  user={user}
                  sessionUserId={sessionUserId}
                  sessionUserName={sessionUserName}
                  sessionUserEmail={sessionUserEmail}
                />
              ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <PostModal open={isModalOpen} userId={userId} onClose={toggleModal} />
      )}
    </div>
  );
}
