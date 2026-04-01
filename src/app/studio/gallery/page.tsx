'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiUpload } from 'react-icons/fi';
import GalleryGrid from '@/components/GalleryGrid';
import { uploadGalleryFile, deleteGalleryFile } from '@/actions/studio-crud';

function StudioGalleryContent() {
    const searchParams = useSearchParams();
    const folder = searchParams.get('folder') || '';

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            setUploadError(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max 50MB.`);
            return;
        }

        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowed.includes(file.type)) {
            setUploadError(`Unsupported type: ${file.type}. Use JPEG, PNG, GIF, WebP, or SVG.`);
            return;
        }

        setIsUploading(true);
        setUploadError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);
            await uploadGalleryFile(formData);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setRefreshTrigger(n => n + 1);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (key: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeleteError('');
        try {
            await deleteGalleryFile(key);
            setRefreshTrigger(n => n + 1);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Failed to delete image');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <h1 className="text-3xl font-bold mb-8">Gallery Management</h1>

            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

                {(uploadError || deleteError) && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {uploadError || deleteError}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? (
                            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Uploading...</>
                        ) : (
                            <><FiUpload size={16} /> Choose Image</>
                        )}
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Max 50MB — JPEG, PNG, GIF, WebP, SVG
                    </span>
                </div>
            </div>

            <GalleryGrid
                baseUrl="/studio/gallery"
                onDelete={handleDelete}
                refreshTrigger={refreshTrigger}
            />
        </div>
    );
}

export default function StudioGalleryPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading gallery...</p>
                </div>
            </div>
        }>
            <StudioGalleryContent />
        </Suspense>
    );
}
