import { prisma } from '@/lib/prisma';
import { getPublicUrl } from '@/lib/aws-s3';
import ProjectCard from '@/components/ProjectCard';

async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return projects.map((project) => ({
    ...project,
    thumbnailUrl: project.thumbnailKey ? getPublicUrl(project.thumbnailKey) : null,
  }));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">
          A collection of things I&apos;ve built.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No projects yet. Check back soon!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
