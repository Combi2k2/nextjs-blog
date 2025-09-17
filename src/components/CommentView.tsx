'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { type Comment } from '@/actions/comment-actions'

interface CommentViewProps {
    comments: Comment[]
}

export default function CommentView({ comments }: CommentViewProps) {
    return (
        <div className="space-y-6">
            {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {comment.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                        {comment.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.content}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
