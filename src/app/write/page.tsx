// import { useState } from 'react';
import { createBlog } from '@/actions/actions';
import BlogForm from '@/components/BlogForm';

export default function CreateBlog() {
    let isSubmitting = false;
    let error = "";

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
            <BlogForm createBlog={createBlog} isSubmitting={isSubmitting} error={error} />
        </div>
    );
}
