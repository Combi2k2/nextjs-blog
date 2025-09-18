'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { S3Image } from '@/lib/aws-s3';
import { FiUpload, FiImage, FiTrash2 } from 'react-icons/fi';
import Pagination from '@/components/Pagination';
import ImageCard from '@/components/ImageCard';
import ImageView from '@/components/ImageView';
import { getGalleryImagesWithUrls, uploadGalleryImage, deleteGalleryImage } from '@/actions/studio-crud';

export default function StudioGalleryPage() {
  const searchParams = useSearchParams();
  const [images, setImages] = useState<S3Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<S3Image | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const folder = searchParams.get('folder') || '';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const images = await getGalleryImagesWithUrls(folder, 1000);
        setImages(images);
      } catch (err) {
        console.error('Error loading studio gallery:', err);
        setError(err instanceof Error ? err.message : 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [folder]);

  const openLightbox = (image: S3Image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      await uploadGalleryImage(formData);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh images
      const updatedImages = await getGalleryImagesWithUrls(folder, 1000);
      setImages(updatedImages);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (key: string, imageName: string) => {
    if (!confirm(`Are you sure you want to delete "${imageName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteError('');

    try {
      await deleteGalleryImage(key);
      // Refresh images
      const updatedImages = await getGalleryImagesWithUrls(folder, 1000);
      setImages(updatedImages);
    } catch (error) {
      console.error('Error deleting image:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Gallery Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to load images from the gallery. Please check your AWS S3 configuration.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const imagesPerPage = 12;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (page - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const paginatedImages = images.slice(startIndex, endIndex);

  // Validate page number
  if (page > totalPages && totalPages > 0) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Page {page} does not exist. There are only {totalPages} pages.
          </p>
          <a 
            href={`/studio/gallery${totalPages > 1 ? `?page=${totalPages}` : ''}`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Go to last page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Gallery Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {images.length} image{images.length !== 1 ? 's' : ''} found
          {folder && ` in folder: ${folder}`}
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
          
          {uploadError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {uploadError}
            </div>
          )}
          
          {deleteError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {deleteError}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload size={16} />
                  Choose File
                </>
              )}
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Max size: 50MB. All file types supported.
            </span>
          </div>
        </div>

        {/* Files Grid */}
        {images.length === 0 ? (
          <div className="text-center py-12">
            <FiImage size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No files found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {folder 
                ? `No files in folder "${folder}"`
                : 'No files uploaded to the gallery yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedImages.map((image) => (
              <div key={image.key} className="group relative">
                {/* Base ImageCard with pre-fetched URL */}
                <ImageCard image={image} onClick={() => openLightbox(image)} />
                
                {/* Delete Button Overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the lightbox
                      handleDeleteImage(image.key, image.name);
                    }}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    title={`Delete ${image.name}`}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                {/* Additional hover overlay for better visual feedback */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-300 rounded-lg transition-colors duration-200 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/studio/gallery"
        />

        {/* Image View Modal */}
        <ImageView
          image={selectedImage!}
          isOpen={!!selectedImage}
          onClose={closeLightbox}
        />
      </div>
    </div>
  );
}