import { NextResponse } from 'next/server';
import { validateInquiry } from '@/lib/validators';
import { createInquiry } from '@/lib/data/inquiries';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

function getClientKey(request) {
    const fwd = request.headers.get('x-forwarded-for');
    if (fwd) return `ip:${fwd.split(',')[0].trim()}`;
    const real = request.headers.get('x-real-ip');
    if (real) return `ip:${real}`;
    return 'ip:local';
}

export async function POST(request) {
    // Rate limit by IP: 5 submissions per 10 minutes.
    const key = getClientKey(request);
    const limit = rateLimit(key, { limit: 5, windowMs: 10 * 60_000 });
    if (!limit.ok) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Too many submissions. Please try again in a few minutes.',
            },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
        );
    }

    let payload;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: 'Invalid request.' },
            { status: 400 }
        );
    }

    const { valid, errors, value } = validateInquiry(payload);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Please check the highlighted fields.', errors },
            { status: 422 }
        );
    }

    try {
        const { id } = await createInquiry(value);
        return NextResponse.json({ ok: true, id }, { status: 201 });
    } catch (err) {
        // Log server-side only. Never send the raw error to the client.
        console.error('[inquiries] failed to save', err);
        return NextResponse.json(
            { ok: false, error: 'We could not save your message. Please try again.' },
            { status: 500 }
        );
    }
}

export function GET() {
    return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
