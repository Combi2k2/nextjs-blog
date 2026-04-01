'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { S3Image } from '@/lib/aws-s3';
import { FiImage } from 'react-icons/fi';
import Pagination from '@/components/Pagination';
import ImageCard from '@/components/ImageCard';
import ImageView from '@/components/ImageView';
import { getGalleryImagesWithUrls } from '@/actions/studio-crud';

interface GalleryGridProps {
    baseUrl: string;
    onDelete?: (key: string, name: string) => Promise<void>;
    refreshTrigger?: number;
}

export default function GalleryGrid({ baseUrl, onDelete, refreshTrigger }: GalleryGridProps) {
    const searchParams = useSearchParams();
    const [images, setImages] = useState<S3Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<S3Image | null>(null);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const folder = searchParams.get('folder') || '';

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                setError(null);
                setImages(await getGalleryImagesWithUrls(folder, 1000));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load gallery');
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, [folder, refreshTrigger]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4" />
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
                    <p className="text-sm text-gray-500 dark:text-gray-500">Error: {error}</p>
                </div>
            </div>
        );
    }

    const imagesPerPage = 12;
    const totalPages = Math.ceil(images.length / imagesPerPage);
    const paginatedImages = images.slice((page - 1) * imagesPerPage, page * imagesPerPage);

    if (page > totalPages && totalPages > 0) {
        return (
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Page {page} does not exist. There are only {totalPages} pages.
                    </p>
                    <a
                        href={`${baseUrl}${totalPages > 1 ? `?page=${totalPages}` : ''}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Go to last page
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                {images.length} image{images.length !== 1 ? 's' : ''} found
                {folder && ` in folder: ${folder}`}
            </p>

            {images.length === 0 ? (
                <div className="text-center py-12">
                    <FiImage size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No images found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {folder ? `No images in folder "${folder}"` : 'No images uploaded yet.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {paginatedImages.map((image) => (
                            <div key={image.key} className="group relative">
                                <ImageCard image={image} onClick={() => setSelectedImage(image)} />
                                {onDelete && (
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(image.key, image.name); }}
                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-colors duration-200"
                                            title={`Delete ${image.name}`}
                                        >
                                            <span className="sr-only">Delete</span>
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Pagination currentPage={page} totalPages={totalPages} baseUrl={baseUrl} />
                </>
            )}

            <ImageView image={selectedImage!} isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} />
        </div>
    );
}
