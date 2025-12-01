import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
    matcher: ['/', '/auth/:path*', '/sales/:path*'],
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const res = NextResponse.next()

    const token = await getToken({
        req: request,
        secret: process.env.JWT_SECRET,
    })
    const isAuthenticated = !!token

    if (isAuthenticated) {
        if (pathname.startsWith('/auth') || pathname === '/') {
            return NextResponse.redirect(new URL('/sales', request.url))
        }
        return res
    } else {
        if (pathname.startsWith('/sales') || pathname === '/') {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        return res
    }
}
