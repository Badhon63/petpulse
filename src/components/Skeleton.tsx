// src/components/Skeleton.tsx
import React from 'react';

export default function Skeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="bg-gray-200 h-48 w-full"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 grow flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          
          {/* Meta Info Skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        
        {/* Button Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-full mt-auto"></div>
      </div>
    </div>
  );
}