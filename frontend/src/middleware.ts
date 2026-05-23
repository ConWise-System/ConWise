import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value?.toLowerCase();
  const { pathname } = request.nextUrl;

  // 1. GLOBAL AUTH CHECK: Protect all private routes
  const protectedPaths = ['/admin', '/projectManager', '/siteEngineer', '/siteSupervisor'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. ROLE AUTHORIZATION: Protect Admin Routes
  if (pathname.startsWith('/admin') && role !== 'company_admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. ROLE AUTHORIZATION: Protect Project Manager Routes
  if (pathname.startsWith('/projectManager') && role !== 'project_manager') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. ROLE AUTHORIZATION: Protect Site Engineer Routes
  if (pathname.startsWith('/siteEngineer') && role !== 'site_engineer') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. ROLE AUTHORIZATION: Protect Site Supervisor Routes
  if (pathname.startsWith('/supervisor') && role !== 'site_supervisor') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 6. LOGIN PAGE REDIRECT: Prevent logged-in users from seeing the login page
  if (pathname === '/login' && token) {
    if (role === 'company_admin') return NextResponse.redirect(new URL('/admin/dashboardHome', request.url));
    if (role === 'project_manager') return NextResponse.redirect(new URL('/projectManager/Home', request.url));
    if (role === 'site_supervisor') return NextResponse.redirect(new URL('/supervisor/Home', request.url));
    if (role === 'site_engineer') return NextResponse.redirect(new URL('/siteEngineer/dashboardHome', request.url));
  }

  return NextResponse.next();
}

// CRITICAL: You must add the new paths to the matcher
export const config = {
  matcher: [
    '/admin/:path*',
    '/projectManager/:path*',
    '/siteEngineer/:path*',
    '/supervisor/:path*',
    '/login',
  ],
};