import { withDB } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { INQUIRY_STATUS } from '@/lib/constants';
import { escapeRegex, serializeDoc } from '@/lib/mongoQuery';


/**
 * Insert a validated inquiry. Input has already been sanitized by validators.
 * @param {object} data
 * @returns {Promise<{ id: string }>}
 */
export async function createInquiry(data) {
    return withDB(async () => {
        const doc = await Inquiry.create(data);
        return { id: String(doc._id) };
    });
}


/**
 * Count inquiries by status.
 */
export async function countInquiries() {
    return withDB(async () => {
        const [total, newCount, reviewed, archived] = await Promise.all([
            Inquiry.countDocuments({}),
            Inquiry.countDocuments({ status: INQUIRY_STATUS.NEW }),
            Inquiry.countDocuments({ status: INQUIRY_STATUS.REVIEWED }),
            Inquiry.countDocuments({ status: INQUIRY_STATUS.ARCHIVED }),
        ]);
        return { total, new: newCount, reviewed, archived };
    });
}

/**
 * Recent inquiries for the dashboard widget.
 * @param {number} [limit=5]
 */
export async function listRecentInquiries(limit = 5) {
    return withDB(async () => {
        return Inquiry.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .then(serializeDoc);
    });
}
/* ── Admin helpers (owner) ──────────────────────────────────────────── */

/**
 * Admin list: all inquiries, newest first, with status + search filters.
 * @param {{ page?: number, pageSize?: number, q?: string, status?: string }} opts
 */
export async function listInquiries({ page = 1, pageSize = 20, q = '', status = '' } = {}) {
    return withDB(async () => {
        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (q && q.trim()) {
            const rx = new RegExp(escapeRegex(q.trim()), 'i');
            filter.$or = [
                { name: rx },
                { organization: rx },
                { email: rx },
                { description: rx },
            ];
        }

        const skip = Math.max(0, (page - 1) * pageSize);
        const [items, total] = await Promise.all([
            Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
            Inquiry.countDocuments(filter),
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

export async function getInquiryById(id) {
    if (!id) return null;
    return withDB(() => Inquiry.findById(id).lean().then(serializeDoc));
}

export async function updateInquiryStatus(id, status) {
    return withDB(() => Inquiry.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean());
}

export async function deleteInquiry(id) {
    return withDB(() => Inquiry.findByIdAndDelete(id));
}
