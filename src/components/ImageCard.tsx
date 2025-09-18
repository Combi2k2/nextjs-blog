'use client';

import { useState } from 'react';
import { S3Image } from '@/lib/aws-s3';
import { FiImage } from 'react-icons/fi';

interface ImageCardProps {
  image: S3Image;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const [hasError, setHasError] = useState(false);
  
  // Use the URL from props if available, otherwise show loading/error state
  const imageUrl = image.url;
  const isLoading = !imageUrl && !hasError;

  return (
    <div
      className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="absolute inset-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        ) : hasError || !imageUrl ? (
          <div className="flex items-center justify-center h-full">
            <FiImage size={32} className="text-gray-400" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={image.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            style={{
              objectPosition: 'center',
            }}
            onError={() => setHasError(true)}
          />
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
      
      {/* Image Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-sm truncate">{image.name}</p>
        {image.size && (
          <p className="text-gray-300 text-xs">
            {(image.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>
    </div>
  );
}
