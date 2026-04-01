import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getFileUrl } from '@/lib/aws-s3';
import StudioProjectEditForm from '@/components/StudioProjectEditForm';

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

async function getProject(id: string) {
    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) notFound();

    let thumbnailUrl: string | null = null;
    if (project.thumbnailKey) {
        try {
            thumbnailUrl = await getFileUrl(project.thumbnailKey);
        } catch {
            // ignore
        }
    }

    return { ...project, thumbnailUrl };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = await params;
    const project = await getProject(id);

    return <StudioProjectEditForm project={project} />;
}
