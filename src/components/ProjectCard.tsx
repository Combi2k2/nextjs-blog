'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiExternalLink } from 'react-icons/fi';

export interface ProjectCardData {
    id: string;
    name: string;
    desc: string;
    thumbnailUrl: string | null;
    link: string | null;
    createdAt: Date;
}

interface ProjectCardProps {
    project: ProjectCardData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const MAX_DESC_LENGTH = 120;
    const truncated = project.desc.length > MAX_DESC_LENGTH
        ? project.desc.slice(0, MAX_DESC_LENGTH).trim() + '...'
        : project.desc;

    return (
        <div className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {project.thumbnailUrl ? (
                <img
                    src={project.thumbnailUrl}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <FiExternalLink size={32} />
                </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                    {project.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                    {truncated}
                </p>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                    {project.link && (
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FiExternalLink size={13} />
                    <span>Visit</span>
                </a>
                )}
            </div>
        </div>
    );
}
