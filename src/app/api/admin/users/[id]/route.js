import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { authorizeAdminRequest } from '@/lib/adminAccess';
import { deleteMemberAccount } from '@/lib/auth';

export const runtime = 'nodejs';

export async function DELETE(_request, { params }) {
    const { response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const { id } = await Promise.resolve(params);
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json(
            { ok: false, error: 'Invalid account id.' },
            { status: 400 }
        );
    }

    const deleted = await deleteMemberAccount(id);
    if (!deleted) {
        return NextResponse.json(
            { ok: false, error: 'Member account not found.' },
            { status: 404 }
        );
    }
    return NextResponse.json({ ok: true });
}
