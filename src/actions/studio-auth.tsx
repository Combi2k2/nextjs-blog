"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

// Simple password-based authentication
export async function verifyPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === adminPassword) {
    // Set authentication cookie with timestamp
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now().toString(16); // Current timestamp in hex
    const cookieValue = `${timestamp}-${sessionToken}`;
    
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 2); // 2-hour session
    
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'studio_session',
      value: cookieValue,
      expires: expirationTime,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax'
    });
    
    // Redirect after setting the cookie
    redirect('/studio/blogs');
  }
  // Invalid password - redirect back to login with error
  redirect('/studio?error=invalid');
}
// Middleware to check if user is authenticated
export async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('studio_session');
  return !!session?.value;
}


