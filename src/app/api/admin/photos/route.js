import { NextResponse } from 'next/server';
import { validatePhoto } from '@/lib/adminValidation';
import { createPhoto } from '@/lib/data/photos';
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

    const { valid, errors, value } = validatePhoto(body);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Please fix the highlighted fields.', errors },
            { status: 422 }
        );
    }

    try {
        const { id } = await createPhoto(value);
        return NextResponse.json({ ok: true, id }, { status: 201 });
    } catch (err) {
        console.error('[admin/photos POST]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not create the photo.' },
            { status: 500 }
        );
    }
}
