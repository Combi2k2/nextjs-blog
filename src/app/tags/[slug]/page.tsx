import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { slug } from 'github-slugger';
import Link from 'next/link';
import { format } from 'date-fns';
import Tag from '@/components/Tag';
import Pagination from '@/components/Pagination';

const BLOGS_PER_PAGE = 5;

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

async function getBlogsByTag(tagSlug: string, page: number = 1) {
  // Get all blogs first to filter by tag
  const allBlogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      tags: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' }
  });

  // Filter blogs that contain the tag (case-insensitive)
  const tagName = tagSlug.replace(/-/g, ' '); // Convert slug back to readable format
  const filteredBlogs = allBlogs.filter(blog => 
    blog.tags.some(tag => 
      slug(tag) === tagSlug || tag.toLowerCase() === tagName.toLowerCase()
    )
  );

  // Apply pagination
  const totalCount = filteredBlogs.length;
  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE);
  const skip = (page - 1) * BLOGS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(skip, skip + BLOGS_PER_PAGE);

  return {
    blogs: paginatedBlogs,
    totalPages,
    currentPage: page,
    totalCount,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  
  const { blogs, totalPages, currentPage, totalCount } = await getBlogsByTag(resolvedParams.slug, page);

  if (blogs.length === 0) {
    notFound();
  }

  // Get the actual tag name from the first blog
  const tagName = blogs[0].tags.find(tag => 
    slug(tag) === resolvedParams.slug || tag.toLowerCase() === resolvedParams.slug.replace(/-/g, ' ').toLowerCase()
  ) || resolvedParams.slug.replace(/-/g, ' ');

  return (
    <div className="flex min-h-screen mt-20">
      <div className="w-72 p-6 border-r border-gray-800">
        <div className="mb-8">
          <Link 
            href="/tags" 
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 mb-4 inline-block"
          >
            ← Back to all tags
          </Link>
          <h3 className="font-bold mb-5">TAG: {tagName.toUpperCase()}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {totalCount} {totalCount === 1 ? 'post' : 'posts'} found
          </p>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-4xl">
        {blogs.map((blog) => (
          <div key={blog.id} className="mb-16">
            <div className="mb-1">{format(new Date(blog.updatedAt), 'MMMM d, yyyy')}</div>

            <h2 className="text-2xl font-bold">
              <Link href={`/blogs/${blog.id}`} className="hover:text-cyan-600 transition">
                {blog.title}
              </Link>
            </h2>

            <div className="flex flex-wrap mb-4">
              {blog.tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.excerpt}</p>
          </div>
        ))}
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/tags/${resolvedParams.slug}`}
        />
      </div>
    </div>
  );
}
