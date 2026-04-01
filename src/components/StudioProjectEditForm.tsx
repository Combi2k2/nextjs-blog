'use client';

import { useState } from 'react';
import ProjectForm from '@/components/ProjectForm';
import { updateProject } from '@/actions/studio-crud';

interface StudioProjectEditFormProps {
    project: {
        id: string;
        name: string;
        desc: string;
        thumbnailKey: string | null;
        thumbnailUrl: string | null;
        link: string | null;
    };
}

export default function StudioProjectEditForm({ project }: StudioProjectEditFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        setError('');
        try {
            await updateProject(project.id, formData);
        } catch {
            setError('Failed to update project. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <ProjectForm
            initialValues={{
                name: project.name,
                desc: project.desc,
                thumbnailKey: project.thumbnailKey,
                thumbnailUrl: project.thumbnailUrl,
                link: project.link,
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
            submitLabel="Save Changes"
        />
    );
}
