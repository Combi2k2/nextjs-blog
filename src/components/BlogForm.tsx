'use client';

import { useState, useDeferredValue } from 'react';
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

type ViewMode = 'edit' | 'split' | 'preview';

export default function BlogForm({ initialData, onSubmit, isSubmitting, error }: BlogFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
    const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
    const [mode, setMode] = useState<ViewMode>('edit');

    // Defer preview inputs so typing stays smooth while markdown re-renders
    const deferredTitle = useDeferredValue(title);
    const deferredContent = useDeferredValue(content);
    const deferredTags = useDeferredValue(tags);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (initialData?.id) {
            formData.append('id', initialData.id);
        }
        await onSubmit(formData);
    };

    const previewTagArray = deferredTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const modes: { key: ViewMode; label: string }[] = [
        { key: 'edit', label: 'Edit' },
        { key: 'split', label: 'Split' },
        { key: 'preview', label: 'Preview' },
    ];

    const segmentedControl = (
        <div className="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
            {modes.map((m, i) => (
                <button
                    key={m.key}
                    type="button"
                    onClick={() => setMode(m.key)}
                    className={
                        'px-4 py-2 text-sm font-medium transition-colors '
                        + (mode === m.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700')
                        + (i > 0 ? ' border-l border-gray-300 dark:border-gray-600' : '')
                    }
                >
                    {m.label}
                </button>
            ))}
        </div>
    );

    const formSection = (
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
                    rows={mode === 'split' ? 24 : 15}
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
    );

    const previewPanel = (
        <BlogView
            title={deferredTitle || 'Blog Title'}
            content={deferredContent || 'Blog content will appear here...'}
            tags={previewTagArray.length > 0 ? previewTagArray : ['example']}
            date={new Date()}
        />
    );

    return (
        <div className={mode === 'split' ? 'px-4 py-8 pt-24' : 'container mx-auto px-4 py-8 pt-24'}>
            <h1 className="text-3xl font-bold text-center mb-4">
                {initialData?.id ? 'Edit Blog' : 'Create New Blog'}
            </h1>
            <div className="flex justify-center mb-6">
                {segmentedControl}
            </div>

            {mode === 'edit' && formSection}

            {mode === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="min-w-0">{formSection}</div>
                    <div className="min-w-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
                        {/* Spacer matches the "Blog Title" label so the preview aligns with the title input */}
                        <div className="hidden lg:block text-sm font-medium mb-1 invisible" aria-hidden="true">
                            Preview
                        </div>
                        {previewPanel}
                    </div>
                </div>
            )}

            {mode === 'preview' && (
                <div className="max-w-4xl mx-auto">{previewPanel}</div>
            )}
        </div>
    );
}
