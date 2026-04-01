'use client';

import Link from 'next/link';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface ProjectActionButtonsProps {
    id: string;
    onDelete: (id: string) => void;
}

export default function ProjectActionButtons({ id, onDelete }: ProjectActionButtonsProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            onDelete(id);
        }
    };

    return (
        <div className="flex justify-end gap-3">
            <Link
                href={`/studio/projects/edit/${id}`}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                <FiEdit size={18} />
            </Link>
            <button
                type="button"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            >
                <FiTrash2 size={18} />
            </button>
        </div>
    );
}
