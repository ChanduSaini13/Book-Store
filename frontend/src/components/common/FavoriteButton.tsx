import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onClick, isLoading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
    >
      {isFavorite ? (
        <HeartIcon className="w-6 h-6 text-red-500" />
      ) : (
        <HeartOutlineIcon className="w-6 h-6 text-gray-400" />
      )}
    </button>
  );
};
