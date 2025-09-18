import Link from 'next/link';
import { FiEdit, FiImage } from 'react-icons/fi';

export default function StudioDashboardPage() {
  const dashboardItems = [
    {
      title: 'Blog Management',
      description: 'Create, edit, and manage your blog posts',
      href: '/studio/blogs',
      icon: FiEdit,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Gallery Management',
      description: 'Upload, organize, and manage your images',
      href: '/studio/gallery',
      icon: FiImage,
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Studio Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your content management studio. Choose what you'd like to manage.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${item.color} text-white transition-colors`}>
                  <IconComponent size={24} />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.description}
              </p>
              
              <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                Manage →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

