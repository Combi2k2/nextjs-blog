import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Tag from './Tag';

import 'katex/dist/katex.min.css';

interface BlogViewProps {
    title: string;
    content: string;
    tags: string[];
    date?: Date;
}

export default function BlogView({ title, content, tags, date }: BlogViewProps) {
    // Custom components for syntax highlighting
    const components = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Only apply SyntaxHighlighter for code blocks (not inline) with language
            if ((inline === false || inline === undefined) && language) {
                return (
                    <SyntaxHighlighter
                        style={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? darcula : tomorrow}
                        language={language}
                        PreTag="div"
                        className="rounded-md my-4"
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                );
            }
            
            // Inline code or code without language - simple styling
            return (
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                </code>
            );
        },
        pre({ children, ...props }: any) {
            // For code blocks, just pass through to let the code component handle it
            return <pre {...props}>{children}</pre>;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="px-6 py-6 md:px-8 md:py-8">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                {date && (
                    <div className="text-gray-500 mb-2">
                        {date.toLocaleDateString()}
                    </div>
                )}
                <div className="mb-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <Tag text={tag} />
                        </span>
                    ))}
                </div>
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <Markdown
                        remarkPlugins={[remarkMath, [remarkGfm, { singleTilde: true }]]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        remarkRehypeOptions={{ allowDangerousHtml: true }}
                        components={components}
                    >
                        {content}
                    </Markdown>
                </article>
            </div>
        </div>
    );
}
