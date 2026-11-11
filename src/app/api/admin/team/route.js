import { NextResponse } from 'next/server';
import { validateTeamMember } from '@/lib/adminValidation';
import { createTeamMember, slugExistsForTeamMember } from '@/lib/data/team';
import { slugify, uniqueSlug } from '@/lib/slug';
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

    const { valid, errors, value } = validateTeamMember(body);
    if (!valid) {
        return NextResponse.json(
            { ok: false, error: 'Please fix the highlighted fields.', errors },
            { status: 422 }
        );
    }

    // A name outside Latin script slugifies to nothing, and `uniqueSlug` would throw and surface as
    // a 500 for what is really a missing field.
    if (!slugify(value.slug || value.name)) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Please provide a slug.',
                errors: { slug: 'Please provide a slug.' },
            },
            { status: 422 }
        );
    }

    try {
        const { id } = await createTeamMember({
            ...value,
            slug: await uniqueSlug(value.slug || value.name, (s) =>
                slugExistsForTeamMember(s, null)
            ),
        });
        return NextResponse.json({ ok: true, id }, { status: 201 });
    } catch (err) {
        console.error('[admin/team POST]', err);
        if (err?.code === 11000) {
            return NextResponse.json(
                { ok: false, error: 'A team member with this slug already exists.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { ok: false, error: 'Could not create the team member.' },
            { status: 500 }
        );
    }
}
