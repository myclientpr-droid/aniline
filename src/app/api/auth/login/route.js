import { NextResponse } from 'next/server';
import { signSession, SESSION_COOKIE } from '@/lib/session';
import { verifyCredentials } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

function clientKey(request) {
    const fwd = request.headers.get('x-forwarded-for');
    if (fwd) return `login:${fwd.split(',')[0].trim()}`;
    const real = request.headers.get('x-real-ip');
    if (real) return `login:${real}`;
    return 'login:local';
}

export async function POST(request) {
    const key = clientKey(request);
    const limit = rateLimit(key, { limit: 5, windowMs: 15 * 60_000 });
    if (!limit.ok) {
        return NextResponse.json(
            { ok: false, error: 'Too many attempts. Try again later.' },
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

    const email = typeof body?.email === 'string' ? body.email : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
        return NextResponse.json(
            { ok: false, error: 'Email and password are required.' },
            { status: 400 }
        );
    }

    try {
        const user = await verifyCredentials(email, password);
        if (!user) {
            return NextResponse.json(
                { ok: false, error: 'Invalid email or password.' },
                { status: 401 }
            );
        }

        const token = await signSession(user);
        const response = NextResponse.json({
            ok: true,
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
        response.cookies.set(SESSION_COOKIE.name, token, SESSION_COOKIE.options);
        return response;
    } catch (err) {
        console.error('[login] authentication failed', err);
        return NextResponse.json(
            { ok: false, error: 'Authentication service unavailable.' },
            { status: 503 }
        );
    }
}

export function GET() {
    return NextResponse.json(
        { ok: false, error: 'Method not allowed.' },
        { status: 405 }
    );
}