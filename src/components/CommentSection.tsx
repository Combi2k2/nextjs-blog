'use client'

import React, { useState, useEffect, useRef } from 'react'
import { type Comment } from '@/actions/comment-actions'
import CommentForm from './CommentForm'
import CommentView from './CommentView'

interface CommentSectionProps {
    blogId: string
    initialComments: Comment[]
}

export default function CommentSection({ blogId, initialComments }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [showFloatingButton, setShowFloatingButton] = useState(false)
    const [showCommentModal, setShowCommentModal] = useState(false)
    const commentSectionRef = useRef<HTMLDivElement>(null)

    const handleCommentAdded = (newComment: Comment) => {
        setComments(prev => [newComment, ...prev])
    }

    const handleCloseModal = () => {
        setShowCommentModal(false)
    }

    // Handle scroll detection for floating button
    useEffect(() => {
        const handleScroll = () => {
            if (commentSectionRef.current) {
                const rect = commentSectionRef.current.getBoundingClientRect()
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0
                setShowFloatingButton(isVisible)
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Check initial position
        
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    return (
        <>
            <div ref={commentSectionRef} className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Comments ({comments.length})
                </h3>

                {/* Comments List */}
                <CommentView comments={comments} />
            </div>

            {/* Floating Comment Button */}
            {showFloatingButton && (
                <button
                    onClick={() => setShowCommentModal(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50"
                    aria-label="Write a comment"
                >
                    <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                    </svg>
                </button>
            )}

            {/* Comment Modal */}
            {showCommentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Add Comment
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <CommentForm 
                                blogId={blogId}
                                onCommentAdded={handleCommentAdded}
                                onClose={handleCloseModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
