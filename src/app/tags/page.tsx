import Link from 'next/link';
import Tag from '@/components/Tag';
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
            <div className="flex max-w-lg flex-wrap">
                {tags.map((tag) => (
                    <div key={tag} className="mt-2 mr-5 mb-2">
                        <Tag text={tag} />
                        <Link
                            href={`/tags/${slug(tag)}`}
                            className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                            aria-label={`View posts tagged ${tag}`}
                        >
                        {` (${tagCounts[tag]})`}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}