'use client';

import { useState } from 'react';
import BlogForm from '@/components/BlogForm';
import { updateBlog } from '@/actions/studio-crud';

interface StudioBlogEditFormProps {
  blog: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
  };
}

export default function StudioBlogEditForm({ blog }: StudioBlogEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await updateBlog(blog.id, formData);
      // Note: updateBlog will redirect automatically, so this won't be reached
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <BlogForm 
      initialData={blog}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}
