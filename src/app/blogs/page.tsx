import React from 'react';
import Link from 'next/link';
import Tag from '@/components/Tag';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { slug } from 'github-slugger';
import Pagination from '@/components/Pagination';

const BLOGS_PER_PAGE = 5;

async function getBlogs(page: number = 1) {
    const skip = (page - 1) * BLOGS_PER_PAGE;
    
    const [blogs, totalCount] = await Promise.all([
        prisma.blog.findMany({
            select: {
                id: true,
                title: true,
                excerpt: true,
                updatedAt: true,
                tags: true,
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: BLOGS_PER_PAGE,
        }),
        prisma.blog.count()
    ]);

    const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);

    return {
        blogs: blogs.map((blog) => ({
            ...blog,
            date: blog.updatedAt.toISOString(),
        })),
        totalPages,
        currentPage: page,
    };
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1', 10);
    
    const { blogs, totalPages, currentPage } = await getBlogs(page);
    const tagCounts: { [key: string]: number } = {};

    // Get all blogs for tag counting (not paginated)
    const allBlogs = await prisma.blog.findMany({
        select: { tags: true }
    });

    allBlogs.forEach((blog) => {
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
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/tags/${slug(tag)}`}
                                className="inline-flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                aria-label={`View posts tagged ${tag}`}
                            >
                                <span className="uppercase">{tag}</span>
                                <span className="ml-1 text-xs opacity-75">({tagCounts[tag]})</span>
                            </Link>
                        ))}
                    </div>
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

                        <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    <Tag text={tag} />
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.excerpt}</p>
                    </div>
                ))}
                
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/blogs"
                />
            </div>
        </div>
    );
}
