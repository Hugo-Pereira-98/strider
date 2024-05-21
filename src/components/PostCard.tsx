import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaRetweet, FaHeart, FaComment } from 'react-icons/fa';
import Badge from './ui/Badge';
import { Post, User, Comment } from '@/utils/interfaces';
import {
  addComment,
  toggleLike,
  followUser,
  getUserById,
  openDB,
} from '@/utils/indexedDB';
import { PostModal } from './Modal/NewPostModal';

interface PostCardProps {
  post: Post;
  user: User;
  sessionUserId: number;
  sessionUserName: string;
  sessionUserEmail: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  user,
  sessionUserId,
  sessionUserName,
  sessionUserEmail,
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);
  const [likes, setLikes] = useState<number[]>(post.likes);
  const [retweets, setRetweets] = useState<number[]>(post.retweets);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      const db = await openDB();
      const sessionUser = await getUserById(db, sessionUserId);
      const following = sessionUser.following.some(
        (followingUser) => followingUser.userId === user.userId
      );
      setIsFollowing(following);
    };

    checkFollowingStatus();
  }, [sessionUserId, user.userId]);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
      : '';
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
      setCommentText(e.target.value);
    }
  };

  const handleCommentKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
    setCommentText('');
  };

  const handleAddComment = async () => {
    if (commentText.trim()) {
      const db = await openDB();
      const newComment: Comment = {
        id: post.comments.length + 1,
        userId: sessionUserId,
        userName: sessionUserName,
        email: sessionUserEmail,
        comment: commentText.trim(),
        commentDate: new Date(),
      };
      await addComment(db, post.id!, newComment);
      setCommentText('');
      post.comments.unshift(newComment);
    }
  };

  const handleToggleLike = async () => {
    const db = await openDB();
    await toggleLike(db, post.id!, sessionUserId);
    const likeIndex = likes.indexOf(sessionUserId);
    if (likeIndex > -1) {
      setLikes((prevLikes) => prevLikes.filter((id) => id !== sessionUserId));
    } else {
      setLikes((prevLikes) => [...prevLikes, sessionUserId]);
    }
  };

  const handleToggleRetweet = async () => {
    setIsPostModalOpen(true);
  };

  const handleFollowToggle = async () => {
    const db = await openDB();
    await followUser(db, sessionUserId, user.userId);
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="animate-fadeIn p-3 pb-0 rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 transition-colors mb-4">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex items-center">
          <div className="rounded-full h-8 w-8 border border-gray-light-400 dark:border-gray-dark-800 flex items-center justify-center relative">
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
        <div onClick={handleFollowToggle} className="cursor-pointer">
          {sessionUserId !== user.userId && (
            <Badge
              color={isFollowing ? 'secondary' : 'primary'}
              label={isFollowing ? 'Unfollow' : 'Follow'}
            />
          )}
        </div>
      </div>

      <p className="text-gray-light-900 dark:text-white mb-3">{post?.post}</p>

      {post.retweetFrom && (
        <div className="bg-gray-light-100 dark:bg-gray-dark-900 p-3 rounded-md mb-3">
          <div className="flex items-center mb-2">
            <div className="rounded-full h-8 w-8 border border-gray-light-400 dark:border-gray-dark-800 flex items-center justify-center relative">
              <span className="body-small-semiBold text-gray-light-500 dark:text-gray-dark-400">
                {getInitials(post.retweetFrom.userName)}
              </span>
            </div>
            <div className="ml-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-light-900 dark:text-white">
                  {post.retweetFrom.userName}
                </span>
                <span className="text-gray-light-500 dark:text-gray-dark-400">
                  @{post.retweetFrom.email.split('@')[0]}
                </span>
              </div>
              <span className="text-gray-light-400 dark:text-gray-dark-500 text-sm">
                {format(new Date(post.retweetFrom.postDate), 'MMMM dd, yyyy')}
              </span>
            </div>
          </div>
          <p className="text-gray-light-900 dark:text-white mb-3">
            {post.retweetFrom.post}
          </p>
        </div>
      )}

      <div className="flex space-x-4 text-gray-light-500 dark:text-gray-dark-400 text-sm mb-2">
        <span
          className={`flex items-center space-x-1 hover:text-green-600 transition-colors cursor-pointer ${
            retweets.includes(sessionUserId) ? 'text-green-600' : ''
          }`}
          onClick={handleToggleRetweet}
        >
          <FaRetweet />
          <span>{retweets.length}</span>
        </span>
        <span
          className={`flex items-center space-x-1 hover:text-red-600 transition-colors cursor-pointer ${
            likes.includes(sessionUserId) ? 'text-red-600' : ''
          }`}
          onClick={handleToggleLike}
        >
          <FaHeart />
          <span>{likes.length}</span>
        </span>
        <span
          className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer"
          onClick={toggleComments}
        >
          <FaComment />
          <span>{post?.comments.length}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {post?.tagged.map((taggedUser) => (
          <Badge key={taggedUser.userId} label={taggedUser.userName} />
        ))}
      </div>
      <div
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
          showComments ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="mt-2 flex items-start space-x-2 py-3 border-t border-gray-light-200 dark:border-gray-dark-800">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={handleCommentChange}
            onKeyDown={handleCommentKeyPress}
            maxLength={100}
            className="w-full p-2 border border-gray-light-300 dark:border-gray-dark-700 bg-gray-light-25 dark:bg-gray-dark-900 rounded-md focus:outline-none focus:border-primary-600 dark:focus:border-primary-500"
          />
          <button
            className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${
              commentText.trim() ? 'visible animate-fadeIn' : 'invisible'
            } focus:outline-none`}
            onClick={handleAddComment}
          >
            Comment
          </button>
        </div>
        <div>
          {post?.comments.map((comment) => (
            <div key={comment?.id} className="mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-light-900 dark:text-white">
                  {comment?.userName}
                </span>
                <span className="text-gray-light-500 dark:text-gray-dark-400">
                  @{comment?.email.split('@')[0]}
                </span>
                <span className="text-gray-light-400 dark:text-gray-dark-500 text-sm">
                  {format(new Date(comment?.commentDate), 'MMMM dd, yyyy')}
                </span>
              </div>
              <p className="text-gray-light-900 dark:text-white">
                {comment?.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="border-b border-gray-light-200 dark:border-gray-dark-800 pb-3 h-2 w-full" />

      {isPostModalOpen && (
        <PostModal
          open={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          userId={sessionUserId}
          retweetFrom={{
            postId: post.id!,
            postDate: post.postDate,
            tagged: post.tagged,
            post: post.post,
            userId: post.userId,
            userName: user.userName,
            email: user.email,
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
