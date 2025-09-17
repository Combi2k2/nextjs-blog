'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Tag from '@/components/Tag';

export interface BlogCardData {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: Date;
}

interface BlogCardProps {
  blog: BlogCardData;
  className?: string;
}

export default function BlogCard({ blog, className = '' }: BlogCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Truncate excerpt to approximately 150 characters
  const MAX_EXCERPT_LENGTH = 150;
  const shouldTruncate = blog.excerpt.length > MAX_EXCERPT_LENGTH;
  const truncatedExcerpt = shouldTruncate 
    ? blog.excerpt.slice(0, MAX_EXCERPT_LENGTH).trim() + '...'
    : blog.excerpt;

  return (
    <div className={`mb-16 ${className}`}>
      <div className="mb-1 text-gray-500 dark:text-gray-400 text-sm">
        {formatDistanceToNow(new Date(blog.updatedAt), { addSuffix: true })}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        <Link 
          href={`/blogs/${blog.id}`} 
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          {blog.title}
        </Link>
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags.map((tag) => (
          <span 
            key={tag} 
            className="inline-flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Tag text={tag} />
          </span>
        ))}
      </div>

      <div className="relative">
        <p 
          className="text-gray-600 dark:text-gray-300 leading-relaxed"
          onMouseEnter={() => shouldTruncate && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {truncatedExcerpt}
        </p>
        
        {/* Tooltip for full excerpt */}
        {showTooltip && shouldTruncate && (
          <div className="absolute z-10 p-4 mt-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-w-md">
            <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Full excerpt:</div>
            <p className="leading-relaxed">{blog.excerpt}</p>
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-200 dark:border-b-gray-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
