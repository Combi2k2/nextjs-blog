'use client';

import Link from 'next/link';
import { FiEdit, FiTrash2, FiEye, FiUpload } from 'react-icons/fi';

interface BlogActionButtonsProps {
    id: string;
    onDelete: (id: string) => void;
    onPublish?: (id: string) => void;
    isDraft?: boolean;
    deleteConfirmMessage?: string;
}

export default function BlogActionButtons({
    id,
    onDelete,
    onPublish,
    isDraft = false,
    deleteConfirmMessage = 'Are you sure you want to delete this blog?'
}: BlogActionButtonsProps) {
    const handleDelete = () => {
        if (confirm(deleteConfirmMessage)) {
            onDelete(id);
        }
    };

    const handlePublish = () => {
        if (!onPublish) return;
        if (confirm('Publish this draft? It will appear on the public /blogs list.')) {
            onPublish(id);
        }
    };

    return (
        <div className="flex justify-end gap-3">
            <Link
                href={`/studio/blogs/edit/${id}`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                title="Edit"
            >
                <FiEdit size={18} />
            </Link>
            <button
                type="button"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Delete"
            >
                <FiTrash2 size={18} />
            </button>
            {isDraft && onPublish ? (
                <button
                    type="button"
                    onClick={handlePublish}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="Publish draft"
                >
                    <FiUpload size={18} />
                </button>
            ) : (
                <Link
                    href={`/blogs/${id}`}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    target="_blank"
                    title="View blog post"
                >
                    <FiEye size={18} />
                </Link>
            )}
        </div>
    );
}
