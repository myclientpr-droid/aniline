import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { validateClient } from '@/lib/adminValidation';
import { updateClient, deleteClient, slugExistsForClient } from '@/lib/data/clients';
import { uniqueSlug } from '@/lib/slug';
import { authorizeAdminRequest } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid client id.' }, { status: 400 });
    }

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
        value.slug = await uniqueSlug(baseSlug, (s) => slugExistsForClient(s, id));
        const updated = await updateClient(id, value);
        if (!updated) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/clients PATCH]', err);
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'Slug conflict. Please choose a different slug.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { ok: false, error: 'Could not update the client.' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid client id.' }, { status: 400 });
    }

    try {
        const removed = await deleteClient(id);
        if (!removed) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/clients DELETE]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not delete the client.' },
            { status: 500 }
        );
    }
}
