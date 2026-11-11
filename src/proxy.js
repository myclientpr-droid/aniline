import { NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/session';

const OWNER_ONLY_PATHS = ['/admin/settings', '/admin/inquiries'];

// Content lists everyone signed-in may view; only their bare list routes.
// Anything deeper (e.g. /new, /<id>) is owner-only.
const READ_ONLY_LISTS = [
    '/admin/projects',
    '/admin/services',
    '/admin/team',
    '/admin/clients',
    '/admin/photos',
    '/admin/videos',
];

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    const isLoginPage = pathname === '/admin/login';
    const isSignupPage = pathname === '/admin/signup';
    const isAuthApi =
        pathname === '/api/auth/login' ||
        pathname === '/api/auth/signup' ||
        pathname === '/api/auth/logout';

    const token = request.cookies.get(SESSION_COOKIE.name)?.value;
    const session = token ? await verifySession(token) : null;

    // Keep login/signup reachable even with a session cookie: the token may
    // refer to a deleted, disabled, or role-changed account.
    if (isLoginPage || isSignupPage || isAuthApi) {
        return NextResponse.next();
    }

    // No valid session → redirect to login (pages) or 401 (JSON).
    if (!session) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json(
                { ok: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    const isOwnerOnlyPath = OWNER_ONLY_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
    if (session.role === 'member' && (pathname === '/admin' || isOwnerOnlyPath)) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json(
                { ok: false, error: 'Forbidden' },
                { status: 403 }
            );
        }
        const url = request.nextUrl.clone();
        url.pathname = '/admin/projects';
        url.search = '';
        return NextResponse.redirect(url);
    }

    // Members are read-only: content lists are viewable, but any deeper
    // admin route (create/edit views) redirects back to the entity list.
    if (session.role === 'member' && !pathname.startsWith('/api/')) {
        const lockedList = READ_ONLY_LISTS.find(
            (path) => pathname.startsWith(`${path}/`)
        );
        if (lockedList) {
            const url = request.nextUrl.clone();
            url.pathname = lockedList;
            url.search = '';
            return NextResponse.redirect(url);
        }
    }

    // Valid session → continue. Attach headers for downstream handlers.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-owner-id', session.id);
    requestHeaders.set('x-owner-email', session.email);
    requestHeaders.set('x-admin-role', session.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
}