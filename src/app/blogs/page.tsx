import React from 'react';
import { prisma } from '@/lib/prisma';
import Pagination from '@/components/Pagination';
import BlogCard from '@/components/BlogCard';
import TagFilter from '@/components/TagFilter';
import { getTagCounts, getTotalBlogCount } from '@/utils/tag-cache';

const BLOGS_PER_PAGE = 5;

async function getBlogs(page: number = 1, selectedTags: string[] = []) {
    const skip = (page - 1) * BLOGS_PER_PAGE;
    
    if (selectedTags.length === 0) {
        // No filtering - use optimized query for current page only
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
            getTotalBlogCount()
        ]);

        const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);

        return {
            blogs: blogs.map((blog) => ({
                ...blog,
                date: blog.updatedAt.toISOString(),
            })),
            totalPages,
            currentPage: page,
            totalCount,
            filteredCount: totalCount,
        };
    } else {
        // Filtering required - need to get all blogs to filter
        // TODO: This could be optimized with database-level filtering in the future
        const allBlogs = await prisma.blog.findMany({
            select: {
                id: true,
                title: true,
                excerpt: true,
                updatedAt: true,
                tags: true,
            },
            orderBy: { updatedAt: 'desc' },
        });

        // Filter blogs by selected tags (AND operation)
        const filteredBlogs = allBlogs.filter(blog => 
            selectedTags.every(selectedTag => 
                blog.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
            )
        );

        // Apply pagination to filtered results
        const filteredCount = filteredBlogs.length;
        const totalPages = Math.ceil(filteredCount / BLOGS_PER_PAGE);
        const paginatedBlogs = filteredBlogs.slice(skip, skip + BLOGS_PER_PAGE);

        return {
            blogs: paginatedBlogs.map((blog) => ({
                ...blog,
                date: blog.updatedAt.toISOString(),
            })),
            totalPages,
            currentPage: page,
            totalCount: allBlogs.length,
            filteredCount,
        };
    }
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
        { blogs, totalPages, currentPage, totalCount, filteredCount },
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
        <div className="fixed top-20 left-0 right-0 bottom-0 flex">
            <TagFilter 
                allTags={tags}
                tagCounts={tagCounts}
                selectedTags={selectedTags}
            />

            <div className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-4xl mx-auto">
                {blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                            No posts found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            No posts match the selected tag filters.
                        </p>
                        <a 
                            href="/blogs" 
                            className="text-teal-600 hover:text-teal-800 dark:hover:text-teal-400"
                        >
                            View all posts
                        </a>
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
        </div>
    );
}
