import { NextResponse } from 'next/server';
import { validateService } from '@/lib/adminValidation';
import { createService, slugExistsForService } from '@/lib/data/services';
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

    const { valid, errors, value } = validateService(body);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Please fix the highlighted fields.', errors },
            { status: 422 }
        );
    }

    try {
        const baseSlug = value.slug || value.title;
        value.slug = await uniqueSlug(baseSlug, (s) => slugExistsForService(s, null));
        const { id } = await createService(value);
        return NextResponse.json({ ok: true, id }, { status: 201 });
    } catch (err) {
        console.error('[admin/services POST]', err);
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'A service with this slug already exists.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { ok: false, error: 'Could not create the service.' },
            { status: 500 }
        );
    }
}
