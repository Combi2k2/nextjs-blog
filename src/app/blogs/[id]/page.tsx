import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BlogView from '@/components/BlogView';
import CommentSection from '@/components/CommentSection';
import { getCommentsByBlogId } from '@/actions/comment-actions';

export default async function Page(props: {params: Promise<{ id: string }>}) {
    const params = await props.params;
    const blog = await prisma.blog.findUnique({
        select: {
            title: true,
            content: true,
            tags: true,
            updatedAt: true
        },
        where: {id: params.id}
    });
    if (!blog) return notFound();

    const comments = await getCommentsByBlogId(params.id);

    return (
        <div className="flex min-h-screen mt-20">
            <div className="w-full max-w-4xl mx-auto">
                <BlogView 
                    title={blog.title} 
                    content={blog.content} 
                    date={blog.updatedAt} 
                    tags={blog.tags}
                />
                <CommentSection blogId={params.id} initialComments={comments} />
            </div>
        </div>
    )
}
