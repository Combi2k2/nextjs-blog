'use client';

import { useState } from 'react';
import ProjectForm from '@/components/ProjectForm';
import { createProject } from '@/actions/studio-crud';

export default function CreateProjectPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        setError('');
        try {
            await createProject(formData);
        } catch {
            setError('Failed to create project. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <ProjectForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
            submitLabel="Create Project"
        />
    );
}
