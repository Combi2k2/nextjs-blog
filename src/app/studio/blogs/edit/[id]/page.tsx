import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StudioBlogEditForm from '@/components/StudioBlogEditForm';

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getBlog(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      tags: true,
    },
  });

  if (!blog) {
    notFound();
  }

  return blog;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const resolvedParams = await params;
  const blog = await getBlog(resolvedParams.id);

  return <StudioBlogEditForm blog={blog} />;
}