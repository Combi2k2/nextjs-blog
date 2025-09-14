import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for a studio route (except the main studio page)
  if (pathname.startsWith('/studio/') && pathname !== '/studio') {
    
    // Get the studio session cookie
    const studioSession = request.cookies.get('studio_session');
    
    // If no session cookie exists, redirect to the studio login page
    if (!studioSession?.value) {
      return NextResponse.redirect(new URL('/studio', request.url));
    }
    
    // Check if cookie is recent (within last 2 hours)
    // This ensures that if password changes, old cookies become invalid
    try {
      const [timestamp] = studioSession.value.split('-');
      const cookieTime = parseInt(timestamp, 16);
      const currentTime = Date.now();
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      if (currentTime - cookieTime > twoHours) {
        // Cookie is too old, clear it and redirect to login
        const response = NextResponse.redirect(new URL('/studio', request.url));
        response.cookies.delete('studio_session');
        return response;
      }
    } catch (error) {
      // If cookie format is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/studio', request.url));
      response.cookies.delete('studio_session');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/studio/:path*'
  ],
};