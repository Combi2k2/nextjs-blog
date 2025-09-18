'use client';

import { useRouter } from 'next/navigation';

interface TagProps {
  text: string;
  isSelected?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  showCount?: boolean;
  count?: number;
  enableNavigation?: boolean; // New prop to enable navigation to filtered blog page
}

export default function Tag({ 
  text, 
  isSelected = false, 
  isClickable = false, 
  onClick, 
  showCount = false, 
  count,
  enableNavigation = false
}: TagProps) {
  const router = useRouter();
  const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors";
  
  const getClasses = () => {
    if (isClickable) {
      if (isSelected) {
        return `${baseClasses} bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500 cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-800`;
      } else {
        return `${baseClasses} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer`;
      }
    } else if (enableNavigation) {
      return `${baseClasses} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors`;
    } else {
      return `${baseClasses} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`;
    }
  };

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    } else if (enableNavigation) {
      // Navigate to filtered blog page with this tag
      router.push(`/blogs?tags=${encodeURIComponent(text)}`);
    }
  };

  const isInteractive = isClickable || enableNavigation;

  return (
    <span 
      className={getClasses()}
      onClick={isInteractive ? handleClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      title={enableNavigation ? `Filter posts by "${text}"` : undefined}
    >
      <span className="uppercase">{text}</span>
      {showCount && count !== undefined && (
        <span className="ml-1 text-xs opacity-75">({count})</span>
      )}
      {isClickable && isSelected && (
        <span className="ml-1 text-xs">✓</span>
      )}
    </span>
  );
}
