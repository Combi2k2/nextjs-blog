import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getPublicUrl } from '@/lib/aws-s3';
import { FiPlus } from 'react-icons/fi';
import { deleteProject } from '@/actions/studio-crud';
import StudioProjectCard from '@/components/StudioProjectCard';

async function getProjects() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return projects.map((project) => ({
        ...project,
        thumbnailUrl: project.thumbnailKey ? getPublicUrl(project.thumbnailKey) : null,
    }));
}

export default async function StudioProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Project Management</h1>
                <Link
                    href="/studio/projects/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                <FiPlus size={20} /> Add Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                No projects yet.{' '}
                <Link href="/studio/projects/create" className="text-blue-600 hover:underline">
                    Add your first one.
                </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <StudioProjectCard
                    key={project.id}
                    project={project}
                    onDelete={deleteProject}
                    />
                ))}
                </div>
            )}
        </div>
    );
}
