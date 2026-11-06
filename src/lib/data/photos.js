import { withDB } from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { PUBLISH_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';

/**
 * List published photos, optionally filtered by category.
 * Returns lean plain objects so they can be passed to client components.
 * @param {{ category?: string }} [opts]
 */
export async function listPublishedPhotos({ category } = {}) {
    return withDB(async () => {
        const filter = { published: PUBLISH_STATUS.PUBLISHED };
        if (category) filter.category = category;

        return Photo.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .lean()
            .then(serializeDoc);
    });
}

/**
 * Distinct categories present in published photos.
 * Useful if you later want to hide empty categories from the filter bar.
 * @returns {Promise<string[]>}
 */
export async function listPublishedPhotoCategories() {
    return withDB(async () => {
        const result = await Photo.distinct('category', {
            published: PUBLISH_STATUS.PUBLISHED,
            category: { $ne: '' },
        });
        return result.filter(Boolean).sort();
    });
}

export async function countPhotos() {
    return withDB(async () => {
        const [total, published, drafts] = await Promise.all([
            Photo.countDocuments({}),
            Photo.countDocuments({ published: PUBLISH_STATUS.PUBLISHED }),
            Photo.countDocuments({ published: PUBLISH_STATUS.DRAFT }),
        ]);
        return { total, published, drafts };
    });
}

/* ── Admin helpers (owner CRUD) ─────────────────────────────────────── */

/**
 * Admin list: all photos, drafts included.
 * @param {{ page?: number, pageSize?: number, q?: string, status?: string, category?: string }} opts
 */
export async function listAllPhotos({ page = 1, pageSize = 24, q = '', status = '', category = '' } = {}) {
    return withDB(async () => {
        const filter = {};
        if (status && status !== 'all') filter.published = status;
        if (category && category !== 'all') filter.category = category;
        if (q && q.trim()) {
            filter.$or = [
                { title: new RegExp(escapeRegex(q.trim()), 'i') },
                { alt: new RegExp(escapeRegex(q.trim()), 'i') },
                { location: new RegExp(escapeRegex(q.trim()), 'i') },
            ];
        }

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Photo.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(pageSize).lean(),
            Photo.countDocuments(filter),
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

export async function getPhotoById(id) {
    if (!id) return null;
    return withDB(() => Photo.findById(id).lean().then(serializeDoc));
}

export async function createPhoto(data) {
    return withDB(async () => {
        const doc = await Photo.create(data);
        return { id: String(doc._id) };
    });
}

export async function updatePhoto(id, data) {
    return withDB(() => Photo.findByIdAndUpdate(id, { $set: data }, { new: true }).lean());
}

export async function deletePhoto(id) {
    return withDB(() => Photo.findByIdAndDelete(id));
}