import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import Tag from './Tag';

import 'katex/dist/katex.min.css';

interface BlogViewProps {
    title: string;
    content: string;
    tags: string[];
    date?: Date;
}

export default function BlogView({ title, content, tags, date }: BlogViewProps) {
    return (
        <div className="w-full max-w-4xl mx-auto my-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="px-6 py-6 md:px-8 md:py-8">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                {date && (
                    <div className="text-gray-500 mb-2">
                        {date.toLocaleDateString()}
                    </div>
                )}
                <div className="mb-6">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            <Tag text={tag} />
                        </span>
                    ))}
                </div>
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <Markdown
                        remarkPlugins={[remarkMath, [remarkGfm, { singleTilde: true }]]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        remarkRehypeOptions={{ allowDangerousHtml: true }}
                    >
                        {content}
                    </Markdown>
                </article>
            </div>
        </div>
    );
}
