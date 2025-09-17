'use client';

import { useState } from 'react';
import BlogView from './BlogView';

interface BlogFormProps {
    initialData?: {
        id?: string;
        title: string;
        content: string;
        excerpt: string;
        tags: string[];
    };
    onSubmit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    error: string;
}

export default function BlogForm({ initialData, onSubmit, isSubmitting, error }: BlogFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
    const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (initialData?.id) {
            formData.append('id', initialData.id);
        }
        await onSubmit(formData);
    };

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    {initialData?.id ? 'Edit Blog' : 'Create New Blog'}
                </h1>
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
            </div>

            {showPreview ? (
                <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 overflow-auto">
                    {/* Studio Navigation - replicated to maintain layout */}
                    <nav className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex">
                                    <div className="flex-shrink-0 flex items-center">
                                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                                            Blog Studio - Preview
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(false)}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium"
                                    >
                                        Close Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main content area with proper layout constraints */}
                    <main className="py-10">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <BlogView 
                                    title={title || 'Blog Title'} 
                                    content={content || 'Blog content will appear here...'} 
                                    tags={tagArray.length > 0 ? tagArray : ['example']} 
                                    date={new Date()}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Blog Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter a captivating title"
                        />
                    </div>

                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Blog Summary
                        </label>
                        <input
                            type="text"
                            id="summary"
                            name="summary"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="A brief summary of your blog"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Blog Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={15}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono"
                            placeholder="Write your blog post using Markdown..."
                        />
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="technology, coding, nextjs, etc."
                        />
                    </div>

                    {error && <div className="text-red-500">{error}</div>}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? (initialData?.id ? 'Updating...' : 'Creating...') : (initialData?.id ? 'Update Blog' : 'Create Blog')}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
