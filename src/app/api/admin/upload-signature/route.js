import { NextResponse } from 'next/server';
import { authorizeAdminRequest } from '@/lib/adminAccess';
import { generateUploadSignature } from '@/lib/cloudinary-server';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const ALLOWED_FOLDERS = new Set([
    'aniline/admin/projects',
    'aniline/admin/clients',
    'aniline/admin/team',
    'aniline/admin/services',
    'aniline/admin/photos',
    'aniline/admin/misc',
]);

export async function POST(request) {
    const { user, response } = await authorizeAdminRequest(['owner']);
    if (response) return response;

    const limit = rateLimit(`upload:${user.id}`, { limit: 60, windowMs: 10 * 60_000 });
    if (!limit.ok) {
        return NextResponse.json(
            { ok: false, error: 'Too many uploads. Please try again shortly.' },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
        );
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
    }

    const folder = typeof body?.folder === 'string' ? body.folder : '';
    if (!ALLOWED_FOLDERS.has(folder)) {
        return NextResponse.json({ ok: false, error: 'Invalid upload folder.' }, { status: 400 });
    }

    try {
        const { publicId, timestamp, signature, apiKey, cloudName } =
            generateUploadSignature({ folder });
        return NextResponse.json({
            ok: true,
            data: { publicId, timestamp, signature, apiKey, cloudName },
        });
    } catch (err) {
        console.error('[admin/upload-signature]', err);
        return NextResponse.json(
            { ok: false, error: 'Uploads are not configured on this server.' },
            { status: 503 }
        );
    }
}
