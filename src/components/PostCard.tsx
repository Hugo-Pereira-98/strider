import { useState } from 'react';
import { format } from 'date-fns';
import { FaRetweet, FaHeart, FaComment } from 'react-icons/fa';
import Badge from './ui/Badge';
import { Post, User, Comment } from '@/utils/interfaces';
import {
  addComment,
  toggleLike,
  toggleRetweet,
  openDB,
} from '@/utils/indexedDB';

interface PostCardProps {
  post: Post;
  user: User;
  sessionUserId: number; // Add this prop to get the session user ID
}

const PostCard: React.FC<PostCardProps> = ({ post, user, sessionUserId }) => {
  const [commentText, setCommentText] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

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
        userName: user.userName,
        email: user.email,
        comment: commentText.trim(),
        commentDate: new Date(),
      };
      await addComment(db, post.id!, newComment);
      setCommentText('');
      // Update the comments locally to reflect the change
      post.comments.unshift(newComment);
    }
  };

  const handleToggleLike = async () => {
    const db = await openDB();
    await toggleLike(db, post.id!, sessionUserId);
    // Update the likes locally to reflect the change
    const likeIndex = post.likes.indexOf(sessionUserId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1); // Dislike the post
    } else {
      post.likes.push(sessionUserId); // Like the post
    }
  };

  const handleToggleRetweet = async () => {
    const db = await openDB();
    await toggleRetweet(db, post.id!, sessionUserId);
    // Update the retweets locally to reflect the change
    const retweetIndex = post.retweets.indexOf(sessionUserId);
    if (retweetIndex > -1) {
      post.retweets.splice(retweetIndex, 1); // Undo retweet
    } else {
      post.retweets.push(sessionUserId); // Retweet
    }
  };

  return (
    <div className="animate-fadeIn p-3 pb-0 rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 transition-colors mb-4">
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
      <p className="text-gray-light-900 dark:text-white mb-3">{post?.post}</p>
      <div className="flex space-x-4 text-gray-light-500 dark:text-gray-dark-400 text-sm mb-2">
        <span
          className="flex items-center space-x-1 hover:text-green-600 transition-colors cursor-pointer"
          onClick={handleToggleRetweet}
        >
          <FaRetweet />
          <span>{post?.retweets.length}</span>
        </span>
        <span
          className="flex items-center space-x-1 hover:text-red-600 transition-colors cursor-pointer"
          onClick={handleToggleLike}
        >
          <FaHeart />
          <span>{post?.likes.length}</span>
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
      {showComments && (
        <div>
          <div className="mt-2 flex items-start space-x-2 py-3 border-t border-gray-light-200 dark:border-gray-dark-800">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={handleCommentChange}
              maxLength={100}
              className="w-full p-2 border border-gray-light-300 dark:border-gray-dark-700 bg-gray-light-25 dark:bg-gray-dark-900 rounded-md focus:outline-none focus:border-primary-600 dark:focus:border-primary-500"
            />
            <button
              className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${
                commentText.trim() ? 'visible' : 'invisible'
              }`}
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
      )}
      <div className="border-b border-gray-light-200 dark:border-gray-dark-800 pb-3 h-2 w-full" />
    </div>
  );
};

export default PostCard;
