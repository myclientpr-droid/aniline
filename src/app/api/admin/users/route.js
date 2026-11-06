import { NextResponse } from 'next/server';
import { authorizeAdminRequest } from '@/lib/adminAccess';
import { createMemberAccount, listMemberAccounts } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const users = await listMemberAccounts();
    return NextResponse.json({ ok: true, users });
}

export async function POST(request) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: 'Invalid JSON.' },
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
        const user = await createMemberAccount({ email, name, password });
        return NextResponse.json({ ok: true, user }, { status: 201 });
    } catch (err) {
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'An account with this email already exists.' },
                { status: 409 }
            );
        }
        console.error('[admin/users POST]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not create the account.' },
            { status: 500 }
        );
    }
}
