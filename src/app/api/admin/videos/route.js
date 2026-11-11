import { NextResponse } from 'next/server';
import { validateVideo } from '@/lib/adminValidation';
import { createVideo, slugExistsForVideo } from '@/lib/data/videos';
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

    const { valid, errors, value } = validateVideo(body);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Please fix the highlighted fields.', errors },
            { status: 422 }
        );
    }

    try {
        // Ensure slug is unique.
        const baseSlug = value.slug || value.title;
        value.slug = await uniqueSlug(baseSlug, (s) => slugExistsForVideo(s, null));
        const { id } = await createVideo(value);
        return NextResponse.json({ ok: true, id }, { status: 201 });
    } catch (err) {
        console.error('[admin/videos POST]', err);
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'A film with this slug already exists.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { ok: false, error: 'Could not create the film.' },
            { status: 500 }
        );
    }
}
