import { NextResponse } from 'next/server';
import { validateClient } from '@/lib/adminValidation';
import { createClient, slugExistsForClient } from '@/lib/data/clients';
import { uniqueSlug } from '@/lib/slug';
import { authorizeAdminRequest } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function POST(request) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
    }

    const { valid, errors, value } = validateClient(body);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Please fix the highlighted fields.', errors },
            { status: 422 }
        );
    }

    try {
        const baseSlug = value.slug || value.name;
        value.slug = await uniqueSlug(baseSlug, (s) => slugExistsForClient(s, null));
        const { id } = await createClient(value);
        return NextResponse.json({ ok: true, id }, { status: 201 });
    } catch (err) {
        console.error('[admin/clients POST]', err);
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'A client with this slug already exists.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { ok: false, error: 'Could not create the client.' },
            { status: 500 }
        );
    }
}
