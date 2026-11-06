import { withDB } from '@/lib/mongodb';
import Client from '@/models/Client';
import { PUBLISH_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';

/**
 * List published clients, optionally filtered by type.
 * @param {{ type?: string, featuredOnly?: boolean }} [opts]
 */
export async function listPublishedClients({ type, featuredOnly = false } = {}) {
    return withDB(async () => {
        const filter = { published: PUBLISH_STATUS.PUBLISHED };
        if (type) filter.type = type;
        if (featuredOnly) filter.featured = true;

        return Client.find(filter)
            .sort({ featured: -1, order: 1, name: 1 })
            .lean()
            .then(serializeDoc);
    });
}

/**
 * Distinct client types present in published clients.
 * @returns {Promise<string[]>}
 */
export async function listPublishedClientTypes() {
    return withDB(async () => {
        const result = await Client.distinct('type', {
            published: PUBLISH_STATUS.PUBLISHED,
            type: { $ne: '' },
        });
        return result.filter(Boolean).sort();
    });
}

export async function countClients() {
    return withDB(async () => {
        const [total, published, drafts] = await Promise.all([
            Client.countDocuments({}),
            Client.countDocuments({ published: PUBLISH_STATUS.PUBLISHED }),
            Client.countDocuments({ published: PUBLISH_STATUS.DRAFT }),
        ]);
        return { total, published, drafts };
    });
}
/* ── Admin helpers (owner CRUD) ─────────────────────────────────────── */

/**
 * Admin list: all clients, drafts included.
 * @param {{ page?: number, pageSize?: number, q?: string, status?: string, type?: string }} opts
 */
export async function listAllClients({ page = 1, pageSize = 20, q = '', status = '', type = '' } = {}) {
    return withDB(async () => {
        const filter = {};
        if (status && status !== 'all') filter.published = status;
        if (type && type !== 'all') filter.type = type;
        if (q && q.trim()) {
            filter.$or = [
                { name: new RegExp(escapeRegex(q.trim()), 'i') },
                { slug: new RegExp(escapeRegex(q.trim()), 'i') },
            ];
        }

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Client.find(filter).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(pageSize).lean(),
            Client.countDocuments(filter),
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

export async function getClientById(id) {
    if (!id) return null;
    return withDB(() => Client.findById(id).lean().then(serializeDoc));
}

export async function slugExistsForClient(slug, excludeId = null) {
    return withDB(async () => {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };
        const count = await Client.countDocuments(filter);
        return count > 0;
    });
}

export async function createClient(data) {
    return withDB(async () => {
        const doc = await Client.create(data);
        return { id: String(doc._id) };
    });
}

export async function updateClient(id, data) {
    return withDB(() => Client.findByIdAndUpdate(id, { $set: data }, { new: true }).lean());
}

export async function deleteClient(id) {
    return withDB(() => Client.findByIdAndDelete(id));
}
