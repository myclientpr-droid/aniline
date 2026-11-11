import { withDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import { PUBLISH_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';

/**
 * The order the public archive is presented in: whatever the owner ticked as featured first, then
 * newest. `listTopPublishedVideo` reads the same sort so the featured band is always tile #1.
 */
const PUBLIC_SORT = { featured: -1, year: -1, createdAt: -1 };

/**
 * List published films with pagination + optional category filter.
 * @param {{ page?: number, pageSize?: number, category?: string }} [opts]
 */
export async function listPublishedVideos({ page = 1, pageSize = 48, category } = {}) {
    return withDB(async () => {
        const filter = { published: PUBLISH_STATUS.PUBLISHED };
        if (category) filter.category = category;

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Video.find(filter)
                .sort(PUBLIC_SORT)
                .skip(skip)
                .limit(pageSize)
                .lean(),
            Video.countDocuments(filter),
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

/**
 * The film that fronts the videography page. Nothing ticked as featured still returns a film —
 * the newest published one — so the page never opens empty-looking.
 * @returns {Promise<object|null>}
 */
export async function listTopPublishedVideo({ category } = {}) {
    return withDB(async () => {
        const filter = { published: PUBLISH_STATUS.PUBLISHED };
        if (category) filter.category = category;

        const film = await Video.find(filter).sort(PUBLIC_SORT).limit(1).lean();
        return serializeDoc(film[0] ?? null);
    });
}

export async function getPublishedVideoBySlug(slug) {
    if (!slug || typeof slug !== 'string') return null;
    return withDB(() =>
        Video.findOne({ slug, published: PUBLISH_STATUS.PUBLISHED })
            .lean()
            .then(serializeDoc)
    );
}

export async function listPublishedVideoSlugs() {
    return withDB(() =>
        Video.find(
            { published: PUBLISH_STATUS.PUBLISHED },
            { slug: 1, updatedAt: 1 }
        ).lean()
    );
}

export async function countVideos() {
    return withDB(async () => {
        const [total, published, drafts] = await Promise.all([
            Video.countDocuments({}),
            Video.countDocuments({ published: PUBLISH_STATUS.PUBLISHED }),
            Video.countDocuments({ published: PUBLISH_STATUS.DRAFT }),
        ]);
        return { total, published, drafts };
    });
}

/* ── Admin helpers (owner CRUD) ─────────────────────────────────────── */

/**
 * Admin list: all films, drafts included.
 * @param {{ page?: number, pageSize?: number, q?: string, status?: string, category?: string }} opts
 */
export async function listAllVideos({
    page = 1,
    pageSize = 20,
    q = '',
    status = '',
    category = '',
} = {}) {
    return withDB(async () => {
        const filter = {};
        if (status && status !== 'all') filter.published = status;
        if (category && category !== 'all') filter.category = category;
        if (q && q.trim()) {
            const needle = new RegExp(escapeRegex(q.trim()), 'i');
            filter.$or = [{ title: needle }, { slug: needle }, { client: needle }];
        }

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Video.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(pageSize).lean(),
            Video.countDocuments(filter),
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

export async function getVideoById(id) {
    if (!id) return null;
    return withDB(() => Video.findById(id).lean().then(serializeDoc));
}

export async function slugExistsForVideo(slug, excludeId = null) {
    return withDB(async () => {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };
        const count = await Video.countDocuments(filter);
        return count > 0;
    });
}

export async function createVideo(data) {
    return withDB(async () => {
        const doc = await Video.create(data);
        return { id: String(doc._id) };
    });
}

export async function updateVideo(id, data) {
    return withDB(() => Video.findByIdAndUpdate(id, { $set: data }, { new: true }).lean());
}

export async function deleteVideo(id) {
    return withDB(() => Video.findByIdAndDelete(id));
}
