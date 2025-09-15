import Link from 'next/link'
import { slug } from 'github-slugger'

export default function Tag({ text }: {text: string}) {
    return (
        <Link
            href={`/tags/${slug(text)}`}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium uppercase transition-colors"
        >
        {text.toUpperCase()}
        </Link>
    )
};