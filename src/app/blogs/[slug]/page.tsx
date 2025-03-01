import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BlogView from '@/components/BlogView';

export default async function Page({ params }: {params: { slug: string }}) {
    const blog = await prisma.blog.findUnique({
        select: {
            title: true,
            content: true,
            tags: true,
            updatedAt: true
        },
        where: {slug: String(params.slug)}
    });
    if (!blog) return notFound();

    return (
        <div className="flex min-h-screen mt-20">
            <BlogView title={blog.title} content={blog.content} date={blog.updatedAt} tags={blog.tags}/>
        </div>
    )
}
