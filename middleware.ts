import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Notary admin — requires admin_auth=1
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const auth = request.cookies.get('admin_auth')
    if (!auth || auth.value !== '1') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Staff cabinet — requires staff_auth=staff_N
  if (pathname.startsWith('/staff') && !pathname.startsWith('/staff/login')) {
    const auth = request.cookies.get('staff_auth')
    if (!auth?.value) {
      return NextResponse.redirect(new URL('/staff/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*'],
}
