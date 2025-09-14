'use client';

import Link from 'next/link';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

interface BlogActionButtonsProps {
    id: string;
    onDelete: (id: string) => void;
    deleteConfirmMessage?: string;
}

export default function BlogActionButtons({ 
    id, 
    onDelete, 
    deleteConfirmMessage = 'Are you sure you want to delete this blog?' 
}: BlogActionButtonsProps) {
    const handleDelete = () => {
        if (confirm(deleteConfirmMessage)) {
            onDelete(id);
        }
    };

    return (
        <div className="flex justify-end gap-3">
            {/* Edit Button */}
            <Link 
                href={`/studio/blogs/edit/${id}`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                <FiEdit size={18} />
            </Link>

            {/* Delete Button */}
            <button 
                type="button"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            >
                <FiTrash2 size={18} />
            </button>

            {/* View Button */}
            <Link 
                href={`/blogs/${id}`}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                target="_blank"
                title="View blog post"
            >
                <FiEye size={18} />
            </Link>
        </div>
    );
}
