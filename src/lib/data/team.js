import { withDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import { PUBLISH_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';

export async function listPublishedTeamMembers() {
    return withDB(() =>
        TeamMember.find({ published: PUBLISH_STATUS.PUBLISHED })
            .sort({ order: 1, name: 1 })
            .lean()
            .then(serializeDoc)
    );
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
            items: serializeDoc(items),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    });
}

export async function getTeamMemberById(id) {
    if (!id) return null;
    return withDB(() => TeamMember.findById(id).lean().then(serializeDoc));
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
