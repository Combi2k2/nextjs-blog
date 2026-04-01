'use client';

import { Suspense } from 'react';
import GalleryGrid from '@/components/GalleryGrid';

function GalleryContent() {
    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <h1 className="text-3xl font-bold mb-8">Gallery</h1>
            <GalleryGrid baseUrl="/gallery" />
        </div>
    );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading gallery...</p>
                </div>
            </div>
        }>
            <GalleryContent />
        </Suspense>
    );
}
