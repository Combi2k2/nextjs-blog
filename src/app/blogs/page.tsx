import React from 'react';
import Link from 'next/link';
import Tag from '@/components/Tag';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { slug } from 'github-slugger';

async function getBlogs() {
    const blogs = await prisma.blog.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            updatedAt: true,
            tags: true,
        },
        orderBy: {updatedAt: 'desc'}
    });

    return blogs.map((blog) => ({
        ...blog,
        date: blog.updatedAt.toISOString(),
    }));
}

export default async function BlogPage() {
    const blogs = await getBlogs();
    const tagCounts: { [key: string]: number } = {};

    blogs.forEach((blog) => {
        blog.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    const tags = Object.keys(tagCounts);

    return (
        <div className="flex min-h-screen mt-20">
            <div className="w-72 p-6 border-r border-gray-800">
                <div className="mb-8">
                    <h3 className="font-bold mb-5">ALL POSTS</h3>
                    {tags.map((tag) => (
                        <div key={tag} className="mb-2 ml-5">
                            <Tag text={tag} />
                            <Link
                                href={`/tags/${slug(tag)}`}
                                className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300 hover:text-teal-600"
                                aria-label={`View posts tagged ${tag}`}
                            >
                            {` (${tagCounts[tag]})`}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-8 max-w-4xl">
                {blogs.map((blog) => (
                    <div key={blog.id} className="mb-16">
                        <div className="mb-1">{format(new Date(blog.date), 'MMMM d, yyyy')}</div>

                        <h2 className="text-2xl font-bold">
                            <Link href={`/blogs/${blog.id}`} className="hover:text-cyan-600 transition">
                                {blog.title}
                            </Link>
                        </h2>

                        <div className="flex flex-wrap mb-4">
                            {blog.tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.excerpt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
