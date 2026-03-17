import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow API routes that use their own auth (API key) to pass through freely
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api/worker') ||
    pathname.startsWith('/api/start-pipeline') ||
    pathname.startsWith('/api/jobs/timeout')
  ) {
    return NextResponse.next()
  }

  // All other routing handled by the app
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/worker/:path*',
    '/api/start-pipeline/:path*',
    '/api/jobs/timeout/:path*',
  ],
}
