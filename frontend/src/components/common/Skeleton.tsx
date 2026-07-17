import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`shimmer bg-gray-200 rounded-lg ${className}`} />
);

export const BookCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <Skeleton className="w-full h-40" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

export const BookDetailSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <Skeleton className="w-full h-96 mb-4" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);
