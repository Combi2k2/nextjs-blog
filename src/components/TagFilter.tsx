'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Tag from '@/components/Tag';

interface TagFilterProps {
  allTags: string[];
  tagCounts: { [key: string]: number };
  selectedTags: string[];
}

export default function TagFilter({ 
  allTags, 
  tagCounts, 
  selectedTags 
}: TagFilterProps) {
  const [checkedTags, setCheckedTags] = useState<string[]>(selectedTags);
  const router = useRouter();

  useEffect(() => {
    setCheckedTags(selectedTags);
  }, [selectedTags]);

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setCheckedTags(prev => [...prev, tag]);
    } else {
      setCheckedTags(prev => prev.filter(t => t !== tag));
    }
  };

  const handleSearch = () => {
    if (checkedTags.length === 0) {
      router.push('/blogs');
    } else {
      router.push(`/blogs?tags=${checkedTags.join(',')}`);
    }
  };

  const handleClearAll = () => {
    setCheckedTags([]);
  };

  const handleSelectAll = () => {
    setCheckedTags([...allTags]);
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            Filter by Tags
          </h3>
          {checkedTags.length > 0 && (
            <span className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-medium px-2 py-1 rounded-full">
              {checkedTags.length} selected
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSelectAll}
            className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            disabled={checkedTags.length === allTags.length}
          >
            Select All
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            disabled={checkedTags.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Scrollable Tag Container */}
      <div className="flex-1 px-6 overflow-hidden">
        <div className="h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Tag
                key={tag}
                text={tag}
                isSelected={checkedTags.includes(tag)}
                isClickable={true}
                showCount={true}
                count={tagCounts[tag]}
                onClick={() => handleTagChange(tag, !checkedTags.includes(tag))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Search Button at Bottom */}
      <div className="p-6 pt-4 flex-shrink-0">
        <button
          onClick={handleSearch}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg"
        >
          {checkedTags.length === 0 ? 'Show All Posts' : `Search (${checkedTags.length} tags)`}
        </button>

        {/* Help text */}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Select tags above to filter posts. Posts must have ALL selected tags.</p>
        </div>
      </div>
    </div>
  );
}
