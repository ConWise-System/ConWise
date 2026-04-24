import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Extract the token from the browser cookies
  const token = request.cookies.get('token')?.value;

  // 2. Define the path the user is trying to reach
  const { pathname } = request.nextUrl;

  // 3. LOGIC: If trying to access the dashboard and NO token exists
  if (pathname.startsWith('/admin') || pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. LOGIC: If already logged in and trying to go to the login/signup page
  if (pathname === '/login') {
    if (token) {
      // Redirect to the leads page since they are already authenticated
      return NextResponse.redirect(new URL('/admin/dashboardHome', request.url));
    }
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}
// 5. THE MATCHER: Only run this middleware on specific routes to keep things fast
export const config = {
  matcher: [
    '/admin/:path*',
    '/login', 
  ],
};