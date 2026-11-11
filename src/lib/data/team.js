import { withDB } from '@/lib/mongodb';
import { connection } from 'next/server';
import TeamMember from '@/models/TeamMember';
import { PUBLISH_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';
import { slugify } from '@/lib/slug';

/**
 * Rows written before the slug field carry no slug at all; they resolve one from the name at read
 * time, so existing members are linkable without a migration and without anyone re-saving them.
 * @param {any} member
 */
function healSlug(member) {
    if (!member) return member;
    const stored = typeof member.slug === 'string' ? member.slug.trim() : '';
    return { ...member, slug: stored || slugify(member.name) };
}

export async function listPublishedTeamMembers() {
    await connection();
    return withDB(() =>
        TeamMember.find({ published: PUBLISH_STATUS.PUBLISHED })
            .sort({ order: 1, name: 1 })
            .lean()
            .then(serializeDoc)
            .then((rows) => rows.map(healSlug))
    );
}

/**
 * Deliberately free of `await connection()`: this feeds generateStaticParams and the sitemap, and
 * awaiting it in those paths would make every member page dynamic.
 * @returns {Promise<Array<{ slug: string, name: string, updatedAt?: string }>>}
 */
export async function listPublishedTeamMemberSlugs() {
    return withDB(() =>
        TeamMember.find(
            { published: PUBLISH_STATUS.PUBLISHED },
            { slug: 1, name: 1, updatedAt: 1 }
        )
            .lean()
            .then((rows) => rows.map(healSlug))
    );
}

/**
 * @param {string} slug
 */
export async function getPublishedTeamMemberBySlug(slug) {
    if (!slug || typeof slug !== 'string') return null;
    return withDB(async () => {
        const direct = await TeamMember.findOne({
            slug,
            published: PUBLISH_STATUS.PUBLISHED,
        })
            .lean()
            .then(serializeDoc);
        if (direct) return healSlug(direct);

        // An explicit slug always wins; only rows that never had one are matched by name.
        const rows = await TeamMember.find({ published: PUBLISH_STATUS.PUBLISHED })
            .lean()
            .then(serializeDoc);
        return healSlug(rows.find((row) => !row.slug && slugify(row.name) === slug) || null);
    });
}

/**
 * @param {string} slug
 * @param {string|null} excludeId
 */
export async function slugExistsForTeamMember(slug, excludeId = null) {
    return withDB(async () => {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };
        return (await TeamMember.countDocuments(filter)) > 0;
    });
}

export async function countTeamMembers() {
    return withDB(async () => {
        const [total, published, drafts] = await Promise.all([
            TeamMember.countDocuments({}),
            TeamMember.countDocuments({ published: PUBLISH_STATUS.PUBLISHED }),
            TeamMember.countDocuments({ published: PUBLISH_STATUS.DRAFT }),
        ]);
        return { total, published, drafts };
    });
}
/* ── Admin helpers (owner CRUD) ─────────────────────────────────────── */

/**
 * Admin list: all team members, drafts included.
 * @param {{ page?: number, pageSize?: number, q?: string, status?: string, role?: string }} opts
 */
export async function listAllTeamMembers({ page = 1, pageSize = 20, q = '', status = '', role = '' } = {}) {
    return withDB(async () => {
        const filter = {};
        if (status && status !== 'all') filter.published = status;
        if (role && role !== 'all') filter.role = role;
        if (q && q.trim()) {
            filter.$or = [{ name: new RegExp(escapeRegex(q.trim()), 'i') }];
        }

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            TeamMember.find(filter).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(pageSize).lean(),
            TeamMember.countDocuments(filter),
        ]);
        return {
            items: serializeDoc(items).map(healSlug),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    });
}

export async function getTeamMemberById(id) {
    if (!id) return null;
    return withDB(() =>
        TeamMember.findById(id).lean().then(serializeDoc).then(healSlug)
    );
}

export async function createTeamMember(data) {
    return withDB(async () => {
        const doc = await TeamMember.create(data);
        return { id: String(doc._id) };
    });
}

export async function updateTeamMember(id, data) {
    return withDB(() => TeamMember.findByIdAndUpdate(id, { $set: data }, { new: true }).lean());
}

export async function deleteTeamMember(id) {
    return withDB(() => TeamMember.findByIdAndDelete(id));
}
