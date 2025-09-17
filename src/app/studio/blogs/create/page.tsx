'use client';

import { useState } from 'react';
import BlogForm from '@/components/BlogForm';
import { createBlog } from '@/actions/studio-crud';

export default function CreateBlogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await createBlog(formData);
      // Note: createBlog will redirect automatically, so this won't be reached
    } catch (err) {
      console.error('Error creating blog:', err);
      setError('Failed to create blog. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <BlogForm 
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}