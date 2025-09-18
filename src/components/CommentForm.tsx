'use client'

import React, { useState, useTransition } from 'react'
import { createComment, type Comment } from '@/actions/comment-actions'

interface CommentFormProps {
    blogId: string
    onCommentAdded?: (comment: Comment) => void
    onClose?: () => void
    className?: string
}

export default function CommentForm({ blogId, onCommentAdded, onClose, className = "" }: CommentFormProps) {
    const [formData, setFormData] = useState({ name: '', content: '' })
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        startTransition(async () => {
            const result = await createComment({
                blogId,
                name: formData.name,
                content: formData.content
            })

            if (result.success && result.comment) {
                setFormData({ name: '', content: '' })
                onCommentAdded?.(result.comment)
                onClose?.()
            } else {
                setError(result.error || 'Failed to post comment')
            }
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError('') // Clear error when user starts typing
    }

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="Your name"
                        disabled={isPending}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comment *
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    maxLength={1000}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-vertical"
                    placeholder="Share your thoughts..."
                    disabled={isPending}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.content.length}/1000 characters
                </div>
            </div>

            {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending || !formData.name.trim() || !formData.content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-gray-800"
            >
                {isPending ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    )
}
