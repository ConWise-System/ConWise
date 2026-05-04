import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  // This converts "Project_Manager" to "project_manager"
  const role = request.cookies.get('role')?.value?.toLowerCase();
  const { pathname } = request.nextUrl;

  // 1. GLOBAL AUTH CHECK: Protect all private routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/projectManager')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. ROLE AUTHORIZATION: Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (role !== 'company_admin') {
      // If not an admin, send PMs home, everyone else to login
      const fallback = role === 'project_manager' ? '/projectManager/Home' : '/login';
      return NextResponse.redirect(new URL(fallback, request.url));
    }
  }

  // 3. ROLE AUTHORIZATION: Protect Project Manager Routes
  if (pathname.startsWith('/projectManager')) {
    if (role !== 'project_manager') {
      // If not a PM, send Admins home, everyone else to login
      const fallback = role === 'company_admin' ? '/admin/dashboardHome' : '/login';
      return NextResponse.redirect(new URL(fallback, request.url));
    }
  }

  // 4. LOGIN PAGE REDIRECT: Prevent logged-in users from seeing the login page
  if (pathname === '/login') {
    // If NO token, let them stay on login (Crucial to prevent loops during logout)
    if (!token) {
      return NextResponse.next();
    }

    // If token exists, send them to their respective dashboards
    if (role === 'company_admin') {
      return NextResponse.redirect(new URL('/admin/dashboardHome', request.url));
    }
    if (role === 'project_manager') {
      return NextResponse.redirect(new URL('/projectManager/Home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/projectManager/:path*',
    '/login',
  ],
};