import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonText: React.FC<SkeletonProps & { lines?: number }> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-3.5 bg-border-dark/60 rounded-md animate-pulse"
          style={{ width: idx === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl p-6 bg-card-dark border border-border-dark flex flex-col gap-4 animate-pulse ${className}`}>
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-xl bg-border-dark" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-4 bg-border-dark w-1/3 rounded" />
          <div className="h-3 bg-border-dark w-1/4 rounded" />
        </div>
      </div>
      <div className="h-16 bg-border-dark/50 rounded-xl mt-2" />
      <div className="h-8 bg-border-dark w-full rounded-xl mt-auto" />
    </div>
  );
};
