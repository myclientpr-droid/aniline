import { isNonEmptyString, isOneOf, isUrl, sanitizeText } from '@/lib/validators';
import {
    PROJECT_CATEGORIES,
    PHOTOGRAPHY_CATEGORIES,
    CLIENT_TYPES,
    TEAM_ROLES,
    PUBLISH_STATUS,
    INQUIRY_STATUS,
} from '@/lib/constants';

const PUBLISH_VALUES = Object.values(PUBLISH_STATUS);
const INQUIRY_STATUS_VALUES = Object.values(INQUIRY_STATUS);

/**
 * @param {any} payload
 * @returns {{ valid: boolean, errors: object, value: object }}
 */
export function validateProject(payload) {
    const errors = {};
    const raw = payload && typeof payload === 'object' ? payload : {};

    const title = sanitizeText(raw.title);
    const slug = sanitizeText(raw.slug);
    const shortDescription = sanitizeText(raw.shortDescription);
    const fullDescription = sanitizeText(raw.fullDescription);
    const category = sanitizeText(raw.category);
    const client = sanitizeText(raw.client);
    const location = sanitizeText(raw.location);
    const yearRaw = raw.year;
    const videoPublicId = sanitizeText(raw.videoPublicId);
    const videoUrl = sanitizeText(raw.videoUrl);
    const published = sanitizeText(raw.published);
    const seoTitle = sanitizeText(raw.seoTitle);
    const seoDescription = sanitizeText(raw.seoDescription);
    const featured = Boolean(raw.featured);
    const servicesProvided = Array.isArray(raw.servicesProvided)
        ? raw.servicesProvided.map((s) => sanitizeText(String(s))).filter(Boolean)
        : [];

    const featuredImage = normalizeMedia(raw.featuredImage);
    const gallery = Array.isArray(raw.gallery)
        ? raw.gallery.map(normalizeMedia).filter((m) => m && m.publicId)
        : [];

    if (!isNonEmptyString(title, { min: 2, max: 200 })) {
        errors.title = 'Title must be 2\u2013200 characters.';
    }
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens.';
    }
    if (shortDescription && shortDescription.length > 300) {
        errors.shortDescription = 'Short description must be under 300 characters.';
    }
    if (fullDescription && fullDescription.length > 20000) {
        errors.fullDescription = 'Full description is too long.';
    }
    if (category && !isOneOf(category, PROJECT_CATEGORIES)) {
        errors.category = 'Invalid category.';
    }
    let year = undefined;
    if (yearRaw !== undefined && yearRaw !== '' && yearRaw !== null) {
        const n = Number(yearRaw);
        if (!Number.isInteger(n) || n < 2000 || n > 2100) {
            errors.year = 'Year must be between 2000 and 2100.';
        } else {
            year = n;
        }
    }
    if (videoUrl && !isUrl(videoUrl)) {
        errors.videoUrl = 'Video URL must be a valid http(s) URL.';
    }
    if (published && !isOneOf(published, PUBLISH_VALUES)) {
        errors.published = 'Invalid publish state.';
    }
    if (seoTitle && seoTitle.length > 200) {
        errors.seoTitle = 'SEO title must be under 200 characters.';
    }
    if (seoDescription && seoDescription.length > 320) {
        errors.seoDescription = 'SEO description must be under 320 characters.';
    }

    const value = {
        title,
        slug,
        shortDescription,
        fullDescription,
        category,
        client,
        location,
        year,
        featuredImage,
        videoPublicId,
        videoUrl,
        gallery,
        servicesProvided,
        featured,
        published: published || 'draft',
        seoTitle,
        seoDescription,
    };

    return { valid: Object.keys(errors).length === 0, errors, value };
}

/**
 * Normalize a media object from the form.
 * @param {any} media
 */
function normalizeMedia(media) {
    if (!media || typeof media !== 'object') return null;
    const publicId = sanitizeText(media.publicId);
    if (!publicId) return null;
    return {
        publicId,
        alt: sanitizeText(media.alt || '').slice(0, 300),
        caption: sanitizeText(media.caption || '').slice(0, 500),
        width: normalizeDimension(media.width),
        height: normalizeDimension(media.height),
    };
}

function normalizeDimension(raw) {
    if (raw === undefined || raw === null || raw === '') return undefined;
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 ? n : undefined;
}
/* ── Simple media ({ publicId, alt }) used by client/team/service ───── */

function normalizeSimpleMedia(media) {
    if (!media || typeof media !== 'object') return { publicId: '', alt: '' };
    return {
        publicId: sanitizeText(media.publicId),
        alt: sanitizeText(media.alt || '').slice(0, 300),
    };
}

function normalizeOrder(raw) {
    if (raw === undefined || raw === null || raw === '') return 0;
    const n = Number(raw);
    return Number.isInteger(n) ? n : 0;
}

/* ── Client ─────────────────────────────────────────────────────────── */

export function validateClient(payload) {
    const errors = {};
    const raw = payload && typeof payload === 'object' ? payload : {};

    const name = sanitizeText(raw.name);
    const slug = sanitizeText(raw.slug);
    const shortDescription = sanitizeText(raw.shortDescription);
    const type = sanitizeText(raw.type);
    const location = sanitizeText(raw.location);
    const website = sanitizeText(raw.website);
    const order = normalizeOrder(raw.order);
    const featured = Boolean(raw.featured);
    const published = sanitizeText(raw.published);
    const logo = normalizeSimpleMedia(raw.logo);

    if (!isNonEmptyString(name, { min: 2, max: 200 })) {
        errors.name = 'Name must be 2\u2013200 characters.';
    }
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens.';
    }
    if (shortDescription && shortDescription.length > 300) {
        errors.shortDescription = 'Short description must be under 300 characters.';
    }
    if (type && !isOneOf(type, CLIENT_TYPES)) {
        errors.type = 'Invalid client type.';
    }
    if (location && location.length > 160) {
        errors.location = 'Location is too long.';
    }
    if (website && !isUrl(website)) {
        errors.website = 'Website must be a valid http(s) URL.';
    }
    if (website && website.length > 500) {
        errors.website = 'Website URL is too long.';
    }
    if (published && !isOneOf(published, PUBLISH_VALUES)) {
        errors.published = 'Invalid publish state.';
    }

    const value = { name, slug, shortDescription, type, location, website, logo, order, featured, published: published || 'draft' };
    return { valid: Object.keys(errors).length === 0, errors, value };
}

/* ── Photo ──────────────────────────────────────────────────────────── */

export function validatePhoto(payload) {
    const errors = {};
    const raw = payload && typeof payload === 'object' ? payload : {};

    const title = sanitizeText(raw.title);
    const category = sanitizeText(raw.category);
    const publicId = sanitizeText(raw.publicId);
    const alt = sanitizeText(raw.alt);
    const caption = sanitizeText(raw.caption);
    const location = sanitizeText(raw.location);
    const order = normalizeOrder(raw.order);
    const featured = Boolean(raw.featured);
    const published = sanitizeText(raw.published);

    if (title && title.length > 200) {
        errors.title = 'Title must be under 200 characters.';
    }
    if (category && !isOneOf(category, PHOTOGRAPHY_CATEGORIES)) {
        errors.category = 'Invalid category.';
    }
    if (!publicId) {
        errors.publicId = 'Please upload or enter the photo.';
    }
    if (alt && alt.length > 300) {
        errors.alt = 'Alt text must be under 300 characters.';
    }
    if (caption && caption.length > 500) {
        errors.caption = 'Caption must be under 500 characters.';
    }
    if (location && location.length > 160) {
        errors.location = 'Location is too long.';
    }
    let year = undefined;
    if (raw.year !== undefined && raw.year !== '' && raw.year !== null) {
        const n = Number(raw.year);
        if (!Number.isInteger(n) || n < 2000 || n > 2100) {
            errors.year = 'Year must be between 2000 and 2100.';
        } else {
            year = n;
        }
    }
    if (published && !isOneOf(published, PUBLISH_VALUES)) {
        errors.published = 'Invalid publish state.';
    }

    const value = {
        title,
        category,
        publicId,
        alt,
        caption,
        location,
        width: normalizeDimension(raw.width),
        height: normalizeDimension(raw.height),
        year,
        order,
        featured,
        published: published || 'draft',
    };
    return { valid: Object.keys(errors).length === 0, errors, value };
}

/* ── Team member ────────────────────────────────────────────────────── */

export function validateTeamMember(payload) {
    const errors = {};
    const raw = payload && typeof payload === 'object' ? payload : {};

    const name = sanitizeText(raw.name);
    const role = sanitizeText(raw.role);
    const bio = sanitizeText(raw.bio);
    const expertise = Array.isArray(raw.expertise)
        ? raw.expertise.map((s) => sanitizeText(String(s))).filter(Boolean)
        : [];
    const photo = normalizeSimpleMedia(raw.photo);
    const socialRaw = raw.social && typeof raw.social === 'object' ? raw.social : {};
    const social = {
        linkedin: sanitizeText(socialRaw.linkedin),
        instagram: sanitizeText(socialRaw.instagram),
    };
    const order = normalizeOrder(raw.order);
    const published = sanitizeText(raw.published);

    if (!isNonEmptyString(name, { min: 2, max: 120 })) {
        errors.name = 'Name must be 2\u2013120 characters.';
    }
    if (role && !isOneOf(role, TEAM_ROLES)) {
        errors.role = 'Invalid team role.';
    }
    if (bio && bio.length > 3000) {
        errors.bio = 'Bio must be under 3000 characters.';
    }
    for (const key of ['linkedin', 'instagram']) {
        if (social[key] && !isUrl(social[key])) {
            errors[`social_${key}`] = 'Must be a valid http(s) URL.';
        }
    }
    if (published && !isOneOf(published, PUBLISH_VALUES)) {
        errors.published = 'Invalid publish state.';
    }

    const value = { name, role, bio, expertise, photo, social, order, published: published || 'draft' };
    return { valid: Object.keys(errors).length === 0, errors, value };
}

/* ── Service ────────────────────────────────────────────────────────── */

export function validateService(payload) {
    const errors = {};
    const raw = payload && typeof payload === 'object' ? payload : {};

    const title = sanitizeText(raw.title);
    const slug = sanitizeText(raw.slug);
    const shortDescription = sanitizeText(raw.shortDescription);
    const description = sanitizeText(raw.description);
    const audience = Array.isArray(raw.audience)
        ? raw.audience.map((s) => sanitizeText(String(s))).filter(Boolean)
        : [];
    const deliverables = Array.isArray(raw.deliverables)
        ? raw.deliverables.map((s) => sanitizeText(String(s))).filter(Boolean)
        : [];
    const heroImage = normalizeSimpleMedia(raw.heroImage);
    const order = normalizeOrder(raw.order);
    const published = sanitizeText(raw.published);
    const seoTitle = sanitizeText(raw.seoTitle);
    const seoDescription = sanitizeText(raw.seoDescription);

    if (!isNonEmptyString(title, { min: 2, max: 160 })) {
        errors.title = 'Title must be 2\u2013160 characters.';
    }
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens.';
    }
    if (shortDescription && shortDescription.length > 300) {
        errors.shortDescription = 'Short description must be under 300 characters.';
    }
    if (description && description.length > 10000) {
        errors.description = 'Description is too long.';
    }
    if (seoTitle && seoTitle.length > 200) {
        errors.seoTitle = 'SEO title must be under 200 characters.';
    }
    if (seoDescription && seoDescription.length > 320) {
        errors.seoDescription = 'SEO description must be under 320 characters.';
    }
    if (published && !isOneOf(published, PUBLISH_VALUES)) {
        errors.published = 'Invalid publish state.';
    }

    const value = { title, slug, shortDescription, description, audience, deliverables, heroImage, order, published: published || 'draft', seoTitle, seoDescription };
    return { valid: Object.keys(errors).length === 0, errors, value };
}

/* ── Inquiry status ─────────────────────────────────────────────────── */

export function validateInquiryStatus(payload) {
    const errors = {};
    const raw = payload && typeof payload === 'object' ? payload : {};
    const status = sanitizeText(raw.status);

    if (!isOneOf(status, INQUIRY_STATUS_VALUES)) {
        errors.status = 'Invalid inquiry status.';
    }

    return { valid: Object.keys(errors).length === 0, errors, value: { status } };
}
