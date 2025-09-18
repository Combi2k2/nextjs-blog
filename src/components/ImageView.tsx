'use client';

import { useState, useEffect } from 'react';
import { S3Image } from '@/lib/aws-s3';
import { FiX, FiImage, FiInfo } from 'react-icons/fi';

interface ImageViewProps {
  image: S3Image;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageView({ image, isOpen, onClose }: ImageViewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!isOpen || !image) {
      setImageUrl(null);
      setIsLoading(true);
      setHasError(false);
      return;
    }

    // Use the URL from the image object if available
    if (image.url) {
      setImageUrl(image.url);
      setIsLoading(false);
      setHasError(false);
    } else {
      // If no URL is provided, show error state
      setImageUrl(null);
      setIsLoading(false);
      setHasError(true);
    }
  }, [image, isOpen]);


  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll and ensure full viewport coverage
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.body.style.height = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !image) {
    return null;
  }

  return (
    <div 
      className="bg-black bg-opacity-90 flex items-center justify-center"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        margin: 0,
        padding: '1rem',
        boxSizing: 'border-box'
      }}
      onClick={handleBackdropClick}
    >
      {/* Header Controls */}
      <div 
        className="absolute top-4 right-4 sm:top-6 sm:right-8 md:top-8 md:right-12 lg:top-12 lg:right-20 xl:top-16 xl:right-32 flex items-center space-x-2 sm:space-x-3 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`group p-1.5 sm:p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200 hover:scale-105 ${
            showInfo ? 'bg-opacity-70 scale-105' : ''
          }`}
          title="Toggle image information"
        >
          <FiInfo 
            size={16}
            className={`sm:w-5 sm:h-5 transition-transform duration-200 ${
              showInfo ? 'rotate-180' : 'group-hover:rotate-12'
            }`}
          />
        </button>
        
        <button
          onClick={onClose}
          className="group p-1.5 sm:p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200 hover:scale-105"
          title="Close (Esc)"
        >
          <FiX 
            size={18}
            className="sm:w-6 sm:h-6 transition-transform duration-200 group-hover:rotate-90"
          />
        </button>
      </div>

      {/* Image Info Panel */}
      {showInfo && (
        <div 
          className="absolute top-16 right-4 sm:top-20 sm:right-8 md:top-24 md:right-12 lg:top-28 lg:right-20 xl:top-32 xl:right-32 bg-black bg-opacity-80 text-white p-3 sm:p-4 rounded-lg max-w-xs sm:max-w-sm z-20 animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1 text-sm">
            {image.size && (
              <p>Size: {(image.size / 1024 / 1024).toFixed(2)} MB</p>
            )}
            {image.lastModified && (
              <p>Modified: {image.lastModified.toLocaleDateString()}</p>
            )}
            {image.contentType && (
              <p>Type: {image.contentType}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Image Container */}
      <div 
        className="relative w-full h-full max-w-[90vw] max-h-[90vh] sm:max-w-[85vw] sm:max-h-[85vh] md:max-w-[80vw] md:max-h-[80vh] lg:max-w-[75vw] lg:max-h-[75vh] xl:max-w-[70vw] xl:max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-6 sm:p-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mb-4"></div>
              <p className="text-white text-base sm:text-lg">Loading image...</p>
            </div>
          ) : hasError || !imageUrl ? (
            <div className="flex flex-col items-center justify-center p-6 sm:p-12 text-white">
              <FiImage size={48} className="sm:w-16 sm:h-16 mb-4 text-gray-400" />
              <p className="text-base sm:text-lg">Failed to load image</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 text-center break-words">{image.name}</p>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={image.name}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
