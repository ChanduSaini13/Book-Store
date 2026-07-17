import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    if (start > 1) pages.push(1, -1); // -1 represents ...
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push(-1, totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {pages.map((p, i) =>
        p === -1 ? (
          <span key={`ellipsis-${i}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              p === page
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
