import { withDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { PUBLISH_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';

/**
 * List published projects with pagination + optional category filter.
 */
export async function listPublishedProjects({
    page = 1,
    pageSize = 12,
    category,
    featuredOnly = false,
} = {}) {
    return withDB(async () => {
        const filter = { published: PUBLISH_STATUS.PUBLISHED };
        if (category) filter.category = category;
        if (featuredOnly) filter.featured = true;

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Project.find(filter)
                .sort({ featured: -1, year: -1, createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .lean(),
            Project.countDocuments(filter),
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

export async function getPublishedProjectBySlug(slug) {
    if (!slug || typeof slug !== 'string') return null;
    return withDB(() =>
        Project.findOne({ slug, published: PUBLISH_STATUS.PUBLISHED })
            .lean()
            .then(serializeDoc)
    );
}

export async function listPublishedProjectSlugs() {
    return withDB(() =>
        Project.find(
            { published: PUBLISH_STATUS.PUBLISHED },
            { slug: 1, updatedAt: 1 }
        ).lean()
    );
}

export async function countProjects() {
    return withDB(async () => {
        const [total, published, drafts] = await Promise.all([
            Project.countDocuments({}),
            Project.countDocuments({ published: PUBLISH_STATUS.PUBLISHED }),
            Project.countDocuments({ published: PUBLISH_STATUS.DRAFT }),
        ]);
        return { total, published, drafts };
    });
}


/**
 * Admin list: all projects, drafts included, newest first.
 * @param {{ page?: number, pageSize?: number, q?: string, status?: string }} opts
 */
export async function listAllProjects({ page = 1, pageSize = 20, q = '', status = '' } = {}) {
    return withDB(async () => {
        const filter = {};
        if (status && status !== 'all') filter.published = status;
        if (q && q.trim()) {
            filter.$or = [
                { title: new RegExp(escapeRegex(q.trim()), 'i') },
                { slug: new RegExp(escapeRegex(q.trim()), 'i') },
                { client: new RegExp(escapeRegex(q.trim()), 'i') },
            ];
        }

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(pageSize).lean(),
            Project.countDocuments(filter),
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
 * Admin single-fetch by id.
 * @param {string} id
 */
export async function getProjectById(id) {
    if (!id) return null;
    return withDB(() => Project.findById(id).lean().then(serializeDoc));
}

/**
 * Check whether a slug is already taken (excluding a specific doc id).
 */
export async function slugExistsForProject(slug, excludeId = null) {
    return withDB(async () => {
        const filter = { slug };
        if (excludeId) filter._id = { $ne: excludeId };
        const count = await Project.countDocuments(filter);
        return count > 0;
    });
}

export async function createProject(data) {
    return withDB(async () => {
        const doc = await Project.create(data);
        return { id: String(doc._id) };
    });
}

export async function updateProject(id, data) {
    return withDB(() =>
        Project.findByIdAndUpdate(id, { $set: data }, { new: true }).lean()
    );
}

export async function deleteProject(id) {
    return withDB(() => Project.findByIdAndDelete(id));
}
