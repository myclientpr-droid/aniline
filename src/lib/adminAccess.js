import { NextResponse } from 'next/server';
import { getAdminUserById } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';

export async function getAuthorizedAdminUser() {
    const session = await getCurrentUser();
    if (!session) return null;

    const user = await getAdminUserById(session.id);
    if (!user || user.role !== session.role || user.email !== session.email) {
        return null;
    }
    return user;
}

export async function authorizeAdminRequest(roles = ['owner', 'member']) {
    const user = await getAuthorizedAdminUser();
    if (!user) {
        return {
            user: null,
            response: NextResponse.json(
                { ok: false, error: 'Unauthorized' },
                { status: 401 }
            ),
        };
    }

    if (!roles.includes(user.role)) {
        return {
            user,
            response: NextResponse.json(
                { ok: false, error: 'Forbidden' },
                { status: 403 }
            ),
        };
    }

    return { user, response: null };
}
