import React from 'react';
import ReactMarkdown from 'react-markdown';
import Tag from './Tag';

interface BlogViewProps {
    title: string;
    content: string;
    tags: string[];
    date?: Date;
}

export default function BlogView({ title, content, tags, date }: BlogViewProps) {
    return (
        <div className="max-w-3xl mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            {date && (
                <div className="text-gray-500 mb-2">
                {date.toLocaleDateString()}
                </div>
            )}
            <div className="mb-4">
                {tags.map((tag) => (
                    <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    <Tag text={tag} />
                    </span>
                ))}
            </div>
            <article className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{content}</ReactMarkdown>
            </article>
        </div>
    );
}
