import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { validateInquiryStatus } from '@/lib/adminValidation';
import { updateInquiryStatus, deleteInquiry } from '@/lib/data/inquiries';
import { authorizeAdminRequest } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid inquiry id.' }, { status: 400 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
    }

    const { valid, errors, value } = validateInquiryStatus(body);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Invalid inquiry status.', errors },
            { status: 422 }
        );
    }

    try {
        const updated = await updateInquiryStatus(id, value.status);
        if (!updated) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/inquiries PATCH]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not update the inquiry.' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid inquiry id.' }, { status: 400 });
    }

    try {
        const removed = await deleteInquiry(id);
        if (!removed) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/inquiries DELETE]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not delete the inquiry.' },
            { status: 500 }
        );
    }
}
