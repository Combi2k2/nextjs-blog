'use client';

import { useRef, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface ProjectFormProps {
    initialValues?: {
        name: string;
        desc: string;
        thumbnailKey: string | null;
        thumbnailUrl?: string | null;
        link?: string | null;
    };
    onSubmit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    error: string;
    submitLabel?: string;
}

export default function ProjectForm({
    initialValues,
    onSubmit,
    isSubmitting,
    error,
    submitLabel = 'Create Project',
}: ProjectFormProps) {
    const [name, setName] = useState(initialValues?.name ?? '');
    const [desc, setDesc] = useState(initialValues?.desc ?? '');
    const [link, setLink] = useState(initialValues?.link ?? '');
    const [thumbnailKey, setThumbnailKey] = useState(initialValues?.thumbnailKey ?? '');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        initialValues?.thumbnailUrl ?? null
    );
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setThumbnailKey(''); // clear old key since we're replacing
    };

    const clearThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setThumbnailKey('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('desc', desc);
        formData.set('link', link);
        formData.set('thumbnailKey', thumbnailKey);
        if (thumbnailFile) {
            formData.set('thumbnailFile', thumbnailFile);
        }
        await onSubmit(formData);
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">{submitLabel}</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="My Awesome Project"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        placeholder="Describe your project..."
                    />
                </div>

                {/* Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Link <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/you/project"
                    />
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Thumbnail <span className="text-gray-400 text-xs">(optional)</span>
                    </label>

                    {thumbnailPreview ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 mb-3">
                            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={clearThumbnail}
                                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow"
                                title="Remove thumbnail"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center mb-3 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:border-blue-400 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FiUpload size={24} className="text-gray-400 mb-2" />
                            <span className="text-gray-400 dark:text-gray-500 text-sm">Click to upload image</span>
                            <span className="text-gray-400 dark:text-gray-500 text-xs mt-1">JPEG, PNG, WebP, GIF</span>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiUpload size={16} />
                        {thumbnailPreview ? 'Replace image' : 'Upload from computer'}
                    </button>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                        {isSubmitting ? 'Saving...' : submitLabel}
                    </button>
                    <a
                        href="/studio/projects"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
                    >
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    );
}
