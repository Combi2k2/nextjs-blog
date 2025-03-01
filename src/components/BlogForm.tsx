interface BlogFormProps {
    createBlog: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    error: string;
}

export default function BlogForm({ createBlog, isSubmitting, error }: BlogFormProps) {
    return (
        <form action={createBlog} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a captivating title"
                />
            </div>

            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Blog Summary</label>
                <input
                    type="text"
                    id="summary"
                    name="summary"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="A brief summary of your blog"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your blog post using Markdown..."
                />
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="technology, coding, nextjs, etc."
                />
            </div>

        {error && <div className="text-red-500">{error}</div>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                    {isSubmitting ? 'Creating...' : 'Create Blog'}
                </button>
            </div>
        </form>
    );
}
