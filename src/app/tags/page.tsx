import Link from 'next/link';
import { slug } from 'github-slugger';
import { prisma } from '@/lib/prisma';

export default async function Page() {
    const blogTags = await prisma.blog.findMany({select: {tags: true}});
    const tagCounts: { [key: string]: number } = {};
    
    blogTags.forEach((blog) => {
        blog.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    const tags = Object.keys(tagCounts);

    return (
        <>
        <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
            <div className="space-x-2 pt-6 pb-8 md:space-y-5">
                <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
                    Tags
                </h1>
            </div>
            <div className="flex max-w-lg flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link
                        key={tag}
                        href={`/tags/${slug(tag)}`}
                        className="inline-flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        aria-label={`View posts tagged ${tag}`}
                    >
                        <span className="uppercase">{tag}</span>
                        <span className="ml-1 text-xs opacity-75">({tagCounts[tag]})</span>
                    </Link>
                ))}
            </div>
        </div>
        </>
    )
}