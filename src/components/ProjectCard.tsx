'use client';

import React from 'react';
import Image from 'next/image';
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

    const handleClick = () => {
        if (project.link) {
            window.open(project.link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            onClick={handleClick}
            className={
                'group flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200'
                + (project.link ? ' cursor-pointer' : '')
            }
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {project.thumbnailUrl ? (
                <Image
                    src={project.thumbnailUrl}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <FiExternalLink size={32} />
                </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4">
                <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                        {project.name}
                    </h3>
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                        {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </span>
                </div>
                {/* description: always visible on touch; hidden until hover on md+ */}
                <div className="mt-2 grid overflow-hidden transition-[grid-template-rows,margin] duration-300 grid-rows-[1fr] md:grid-rows-[0fr] md:mt-0 md:group-hover:grid-rows-[1fr] md:group-hover:mt-2">
                    <div className="min-h-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {truncated}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
