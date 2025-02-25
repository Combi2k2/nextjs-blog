import Link from 'next/link'
import { slug } from 'github-slugger'

export default function Tag({ text }: {text: string}) {
    return (
        <Link
            href={`/tags/${slug(text)}`}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase hover:text-teal-600"
        >
        {text.toUpperCase()}
        </Link>
    )
};