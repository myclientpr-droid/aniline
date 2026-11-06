import { withDB } from '@/lib/mongodb';
import Service from '@/models/Service';
import { PUBLISH_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';

export async function listPublishedServices() {
    return withDB(() =>
        Service.find({ published: PUBLISH_STATUS.PUBLISHED })
            .sort({ order: 1, title: 1 })
            .lean()
            .then(serializeDoc)
    );
}

export async function getPublishedServiceBySlug(slug) {
    if (!slug) return null;
    return withDB(() =>
        Service.findOne({ slug, published: PUBLISH_STATUS.PUBLISHED })
            .lean()
            .then(serializeDoc)
    );
}

export async function countServices() {
    return withDB(async () => {
        const [total, published, drafts] = await Promise.all([
            Service.countDocuments({}),
            Service.countDocuments({ published: PUBLISH_STATUS.PUBLISHED }),
            Service.countDocuments({ published: PUBLISH_STATUS.DRAFT }),
        ]);
        return { total, published, drafts };
    });
}
/* ── Admin helpers (owner CRUD) ─────────────────────────────────────── */

/**
 * Admin list: all services, drafts included, newest first.
 * @param {{ page?: number, pageSize?: number, q?: string, status?: string }} opts
 */
export async function listAllServices({ page = 1, pageSize = 20, q = '', status = '' } = {}) {
    return withDB(async () => {
        const filter = {};
        if (status && status !== 'all') filter.published = status;
        if (q && q.trim()) {
            filter.$or = [
                { title: new RegExp(escapeRegex(q.trim()), 'i') },
                { slug: new RegExp(escapeRegex(q.trim()), 'i') },
            ];
        }

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Service.find(filter).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(pageSize).lean(),
            Service.countDocuments(filter),
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

export async function getServiceById(id) {
    if (!id) return null;
    return withDB(() => Service.findById(id).lean().then(serializeDoc));
}

export async function slugExistsForService(slug, excludeId = null) {
    return withDB(async () => {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };
        const count = await Service.countDocuments(filter);
        return count > 0;
    });
}

export async function createService(data) {
    return withDB(async () => {
        const doc = await Service.create(data);
        return { id: String(doc._id) };
    });
}

export async function updateService(id, data) {
    return withDB(() => Service.findByIdAndUpdate(id, { $set: data }, { new: true }).lean());
}

export async function deleteService(id) {
    return withDB(() => Service.findByIdAndDelete(id));
}
