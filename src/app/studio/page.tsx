import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StudioLoginForm from '@/components/StudioLoginForm';

export default async function StudioPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  // Check if user is already authenticated
  const cookieStore = await cookies();
  const studioSession = cookieStore.get('studio_session');
  
  // If user has a valid session, redirect to studio/blogs
  if (studioSession?.value) {
    // Check if cookie is recent (within last 2 hours)
    try {
      const [timestamp] = studioSession.value.split('-');
      const cookieTime = parseInt(timestamp, 16);
      const currentTime = Date.now();
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      if (currentTime - cookieTime <= twoHours) {
        // Cookie is valid, redirect to studio/blogs
        redirect('/studio/blogs');
      }
    } catch {
      // If cookie format is invalid, continue to login form
    }
  }
  
  // If no valid session, show login form
  const params = await searchParams;
  return <StudioLoginForm error={params?.error} />;
}