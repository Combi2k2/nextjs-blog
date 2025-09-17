'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface CreateCommentData {
    blogId: string
    name: string
    content: string
}

export interface Comment {
    id: string
    blogId: string
    name: string
    content: string
    timestamp: Date
}

export async function createComment(data: CreateCommentData) {
    try {
        // Validate input
        if (!data.blogId || !data.name || !data.content) {
            return { success: false, error: 'All fields are required' }
        }

        if (data.name.trim().length < 1 || data.name.trim().length > 50) {
            return { success: false, error: 'Name must be between 1 and 50 characters' }
        }

        if (data.content.trim().length < 1 || data.content.trim().length > 1000) {
            return { success: false, error: 'Comment must be between 1 and 1000 characters' }
        }

        // Check if blog exists
        const blogExists = await prisma.blog.findUnique({
            where: { id: data.blogId }
        })

        if (!blogExists) {
            return { success: false, error: 'Blog not found' }
        }

        // Create comment
        const comment = await prisma.comment.create({
            data: {
                blogId: data.blogId,
                name: data.name.trim(),
                content: data.content.trim(),
            }
        })

        // Revalidate the blog page to show new comment
        revalidatePath(`/blogs/${data.blogId}`)

        return { success: true, comment }
    } catch (error) {
        console.error('Error creating comment:', error)
        return { success: false, error: 'Failed to create comment' }
    }
}

export async function getCommentsByBlogId(blogId: string): Promise<Comment[]> {
    try {
        const comments = await prisma.comment.findMany({
            where: { blogId },
            orderBy: { timestamp: 'desc' }
        })

        return comments
    } catch (error) {
        console.error('Error fetching comments:', error)
        return []
    }
}

export async function deleteComment(commentId: string, blogId: string) {
    try {
        await prisma.comment.delete({
            where: { id: commentId }
        })

        // Revalidate the blog page
        revalidatePath(`/blogs/${blogId}`)

        return { success: true }
    } catch (error) {
        console.error('Error deleting comment:', error)
        return { success: false, error: 'Failed to delete comment' }
    }
}

export async function getCommentCount(blogId: string): Promise<number> {
    try {
        const count = await prisma.comment.count({
            where: { blogId }
        })

        return count
    } catch (error) {
        console.error('Error counting comments:', error)
        return 0
    }
}
