import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

/**
 * Tag counts for the /blogs sidebar. Backed by Next.js Data Cache and
 * invalidated by `revalidateTag('blogs')` on any blog create/update/delete.
 */
export const getTagCounts = unstable_cache(
    async (): Promise<Record<string, number>> => {
        const blogs = await prisma.blog.findMany({
            where: { published: true },
            select: { tags: true },
        });
        const counts: Record<string, number> = {};
        for (const blog of blogs) {
            for (const tag of blog.tags) {
                counts[tag] = (counts[tag] ?? 0) + 1;
            }
        }
        return counts;
    },
    ['blog-tag-counts'],
    { tags: ['blogs'], revalidate: 3600 },
);
