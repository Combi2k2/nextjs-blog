'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { S3Image } from '@/lib/aws-s3';
import { FiX, FiImage, FiInfo } from 'react-icons/fi';

interface ImageViewProps {
  image: S3Image;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageView({ image, isOpen, onClose }: ImageViewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using portals
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get image URL when component mounts or image changes
  useEffect(() => {
    if (image && isOpen) {
      setImageUrl(image.url || null);
      setHasError(false);
    }
  }, [image, isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

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
  }, [isOpen, onClose]);

  if (!isOpen || !image || !mounted) {
    return null;
  }

  const modalContent = (
    <div 
      className="fixed bg-black bg-opacity-90 flex items-center justify-center"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999
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
      <div className="relative w-full h-full p-4 sm:p-8 flex items-center justify-center">
        {hasError || !imageUrl ? (
          <div className="flex flex-col items-center justify-center text-white p-8 sm:p-12">
            <FiImage size={48} className="sm:w-16 sm:h-16 mb-4 text-gray-400" />
            <p className="text-base sm:text-lg">Failed to load image</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 text-center break-words">{image.name}</p>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={image.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ 
                width: 'auto',
                height: 'auto',
                maxWidth: 'calc(100vw - 2rem)',
                maxHeight: 'calc(100vh - 2rem)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Render modal using portal to ensure it's at the top level of the DOM
  return createPortal(modalContent, document.body);
}