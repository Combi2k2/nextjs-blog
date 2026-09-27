import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Pagination from '@/components/Pagination';
import BlogCard from '@/components/BlogCard';
import TagFilter from '@/components/TagFilter';
import { getTagCounts } from '@/utils/tag-cache';

const BLOGS_PER_PAGE = 5;

async function getBlogs(page: number = 1, selectedTags: string[] = []) {
    const skip = (page - 1) * BLOGS_PER_PAGE;
    const where = selectedTags.length > 0
        ? { tags: { hasEvery: selectedTags } }
        : {};

    const [blogs, filteredCount] = await prisma.$transaction([
        prisma.blog.findMany({
            where,
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
        prisma.blog.count({ where }),
    ]);

    return {
        blogs: blogs.map((blog) => ({
            ...blog,
            date: blog.updatedAt.toISOString(),
        })),
        totalPages: Math.ceil(filteredCount / BLOGS_PER_PAGE),
        currentPage: page,
    };
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    tags?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1', 10);
    const selectedTags = resolvedParams.tags ? resolvedParams.tags.split(',').filter(Boolean) : [];
    
    const [
        { blogs, totalPages, currentPage },
        tagCounts
    ] = await Promise.all([
        getBlogs(page, selectedTags),
        getTagCounts()
    ]);
    
    const tags = Object.keys(tagCounts).sort();

    // Build base URL for pagination with current tag filters
    const baseUrl = selectedTags.length > 0 
        ? `/blogs?tags=${selectedTags.join(',')}`
        : '/blogs';

    return (
        <>
            <TagFilter 
                allTags={tags}
                tagCounts={tagCounts}
                selectedTags={selectedTags}
            />

            <div className="lg:ml-80 min-h-screen pt-20">
                <div className="p-4 lg:p-8 max-w-4xl mx-auto">
                {blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                            No posts found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            No posts match the selected tag filters.
                        </p>
                        <Link 
                            href="/blogs" 
                            className="text-teal-600 hover:text-teal-800 dark:hover:text-teal-400"
                        >
                            View all posts
                        </Link>
                    </div>
                ) : (
                    <>
                        {blogs.map((blog) => (
                            <BlogCard 
                                key={blog.id} 
                                blog={{
                                    id: blog.id,
                                    title: blog.title,
                                    excerpt: blog.excerpt,
                                    tags: blog.tags,
                                    updatedAt: blog.updatedAt
                                }}
                            />
                        ))}
                        
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl={baseUrl}
                        />
                    </>
                )}
                </div>
            </div>
        </>
    );
}
