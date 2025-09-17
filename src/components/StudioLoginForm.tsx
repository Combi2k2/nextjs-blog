'use client';

import { verifyPassword } from '@/actions/studio-auth';
import { useState, useTransition } from 'react';

interface StudioLoginFormProps {
  error?: string;
}

export default function StudioLoginForm({ error }: StudioLoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState('');

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await verifyPassword(formData);
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Studio Access</h1>
        
        {error === 'invalid' && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Invalid password. Please try again.
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              placeholder="Enter admin password"
              required
              disabled={isPending}
            />
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Verifying...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
