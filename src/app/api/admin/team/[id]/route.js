import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { validateTeamMember } from '@/lib/adminValidation';
import { updateTeamMember, deleteTeamMember } from '@/lib/data/team';
import { authorizeAdminRequest } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid member id.' }, { status: 400 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
    }

    const { valid, errors, value } = validateTeamMember(body);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Please fix the highlighted fields.', errors },
            { status: 422 }
        );
    }

    try {
        const updated = await updateTeamMember(id, value);
        if (!updated) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/team PATCH]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not update the team member.' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ ok: false, error: 'Invalid member id.' }, { status: 400 });
    }

    try {
        const removed = await deleteTeamMember(id);
        if (!removed) {
            return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[admin/team DELETE]', err);
        return NextResponse.json(
            { ok: false, error: 'Could not delete the team member.' },
            { status: 500 }
        );
    }
}
