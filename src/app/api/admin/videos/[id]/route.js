import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { validateVideo } from '@/lib/adminValidation';
import { deleteVideo, slugExistsForVideo, updateVideo } from '@/lib/data/videos';
import { uniqueSlug } from '@/lib/slug';
import { authorizeAdminRequest } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid film id.' }, { status: 400 });
    }

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
        const baseSlug = value.slug || value.title;
        value.slug = await uniqueSlug(baseSlug, (s) => slugExistsForVideo(s, id));
        const updated = await updateVideo(id, value);
        if (!updated) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/videos PATCH]', err);
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'Slug conflict. Please choose a different slug.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { ok: false, error: 'Could not update the film.' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid film id.' }, { status: 400 });
    }

    try {
        const removed = await deleteVideo(id);
        if (!removed) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/videos DELETE]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not delete the film.' },
            { status: 500 }
        );
    }
}
