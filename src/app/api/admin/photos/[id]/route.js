import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { validatePhoto } from '@/lib/adminValidation';
import { updatePhoto, deletePhoto } from '@/lib/data/photos';
import { authorizeAdminRequest } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid photo id.' }, { status: 400 });
    }

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
        const updated = await updatePhoto(id, value);
        if (!updated) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/photos PATCH]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not update the photo.' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid photo id.' }, { status: 400 });
    }

    try {
        const removed = await deletePhoto(id);
        if (!removed) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/photos DELETE]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not delete the photo.' },
            { status: 500 }
        );
    }
}
