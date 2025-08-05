import React from 'react';

// This component renders a simple shimmering placeholder.
const SkeletonLoader = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-3/4"></div>
      <div className="space-y-3 mt-4">
        <div className="h-4 bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-4/6"></div>
      </div>
      <div className="space-y-3 mt-8">
        <div className="h-5 bg-slate-700 rounded w-1/2"></div>
        <div className="h-12 bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
