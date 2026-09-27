'use client';

import Link from 'next/link';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ProjectCard, { ProjectCardData } from '@/components/ProjectCard';

interface StudioProjectCardProps {
    project: ProjectCardData;
    onDelete: (id: string) => void;
}

export default function StudioProjectCard({ project, onDelete }: StudioProjectCardProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            onDelete(project.id);
        }
    };

    return (
        <div className="relative group">
            <ProjectCard project={project} />

            {/* Hover action overlay */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <Link
                href={`/studio/projects/edit/${project.id}`}
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg shadow hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                title="Edit"
                >
                <FiEdit size={16} />
                </Link>
                <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="p-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-lg shadow hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                title="Delete"
                >
                <FiTrash2 size={16} />
                </button>
            </div>
        </div>
    );
}
