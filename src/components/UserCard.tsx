import React from 'react';
import { User } from '@/utils/interfaces';
import Badge from '@/components/ui/Badge';

interface UserCardProps {
  user: User;
  onClick: (userId: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')
      : '';
  };

  return (
    <div
      className="animate-fadeIn p-3 rounded-md hover:bg-gray-light-50 dark:hover:bg-gray-dark-800 border border-gray-50 dark:border-gray-dark-800 transition-colors mb-4 cursor-pointer w-96"
      onClick={() => onClick(user.userId)}
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center mb-2">
          <div className="rounded-full h-8 w-8 border border-gray-light-400 dark:border-gray-dark-800 flex items-center justify-center mr-3">
            <span className="body-small-semiBold text-gray-light-500 dark:text-gray-dark-400">
              {getInitials(user.userName)}
            </span>
          </div>
          <div className="text-start">
            <span className="font-bold text-gray-light-900 dark:text-white block">
              {user.userName}
            </span>
            <span className="text-gray-light-500 dark:text-gray-dark-400 block">
              @{user.email.split('@')[0]}
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-2 space-x-2">
          <Badge color="primary" label={`${user.followers.length} Followers`} />
          <Badge
            color="secondary"
            label={`${user.following.length} Following`}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
