import { NextResponse } from 'next/server';
import { createAdminAccount } from '@/lib/auth';
import { signSession, SESSION_COOKIE } from '@/lib/session';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

function clientKey(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return `signup:${forwarded.split(',')[0].trim()}`;
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return `signup:${realIp}`;
    return 'signup:local';
}

export async function POST(request) {
    const limit = rateLimit(clientKey(request), {
        limit: 5,
        windowMs: 15 * 60_000,
    });
    if (!limit.ok) {
        return NextResponse.json(
            { ok: false, error: 'Too many signup attempts. Try again later.' },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
        );
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: 'Invalid request.' },
            { status: 400 }
        );
    }

    const email =
        typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
        return NextResponse.json(
            { ok: false, error: 'Enter a valid email address.' },
            { status: 422 }
        );
    }
    if (name.length > 120) {
        return NextResponse.json(
            { ok: false, error: 'Name must be 120 characters or fewer.' },
            { status: 422 }
        );
    }
    if (
        password.length < 12 ||
        Buffer.byteLength(password, 'utf8') > 72
    ) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Password must be at least 12 characters and no more than 72 bytes.',
            },
            { status: 422 }
        );
    }

    try {
        const user = await createAdminAccount({ email, name, password });
        const token = await signSession(user);
        const response = NextResponse.json({ ok: true });
        response.cookies.set(SESSION_COOKIE.name, token, SESSION_COOKIE.options);
        return response;
    } catch (err) {
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'An account with this email already exists.' },
                { status: 409 }
            );
        }
        console.error('[auth/signup]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not create the account.' },
            { status: 500 }
        );
    }
}

export function GET() {
    return NextResponse.json(
        { ok: false, error: 'Method not allowed.' },
        { status: 405 }
    );
}
