/**
 * Minimal, dependency-free validators.
 * Every public form submission MUST run through these on the server.
 */

import { PROJECT_CATEGORIES } from '@/lib/constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{6,20}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isNonEmptyString(v, { min = 1, max = 5000 } = {}) {
    return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
}

export function isEmail(v) {
    return typeof v === 'string' && v.length <= 254 && EMAIL_RE.test(v.trim());
}

export function isPhone(v) {
    return typeof v === 'string' && PHONE_RE.test(v.trim());
}

export function isSlug(v) {
    return typeof v === 'string' && SLUG_RE.test(v);
}

export function isUrl(v) {
    if (typeof v !== 'string' || v.length > 2048) return false;
    try {
        const url = new URL(v);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function isOneOf(v, list) {
    return list.includes(v);
}

/**
 * Strip control characters and trim. Preserves normal punctuation.
 * @param {string} v
 * @returns {string}
 */
export function sanitizeText(v) {
    if (typeof v !== 'string') return '';
    return v
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
        .trim();
}

/**
 * Validate an inquiry form payload.
 * Returns { valid: boolean, errors: object, value: object }.
 * Never throws.
 * @param {any} payload
 */
export function validateInquiry(payload) {
    const errors = {};
    const raw = payload && typeof payload === 'object' ? payload : {};

    const name = sanitizeText(raw.name);
    const organization = sanitizeText(raw.organization);
    const email = sanitizeText(raw.email);
    const phone = sanitizeText(raw.phone);
    const projectCategory = sanitizeText(raw.projectCategory);
    const location = sanitizeText(raw.location);
    const preferredDate = sanitizeText(raw.preferredDate);
    const timeline = sanitizeText(raw.timeline);
    const description = sanitizeText(raw.description);
    const referenceLinksRaw = sanitizeText(raw.referenceLinks);

    if (!isNonEmptyString(name, { min: 2, max: 120 })) {
        errors.name = 'Please enter your name (2\u2013120 characters).';
    }
    if (organization && organization.length > 160) {
        errors.organization = 'Organization name is too long.';
    }
    if (!isEmail(email)) {
        errors.email = 'Please enter a valid email address.';
    }
    if (phone && !isPhone(phone)) {
        errors.phone = 'Please enter a valid phone or WhatsApp number.';
    }
    if (!isNonEmptyString(projectCategory, { min: 2, max: 80 })) {
        errors.projectCategory = 'Please select a project type.';
    } else if (!isOneOf(projectCategory, PROJECT_CATEGORIES)) {
        errors.projectCategory = 'Please select a valid project type.';
    }
    if (location && location.length > 160) {
        errors.location = 'Location is too long.';
    }
    if (preferredDate && preferredDate.length > 40) {
        errors.preferredDate = 'Preferred date is too long.';
    }
    if (timeline && timeline.length > 120) {
        errors.timeline = 'Timeline is too long.';
    }
    if (!isNonEmptyString(description, { min: 10, max: 5000 })) {
        errors.description = 'Please describe your project (10\u20135000 characters).';
    }
    const referenceLinks = referenceLinksRaw
        ? referenceLinksRaw
              .split(/[\s,]+/)
              .map((s) => s.trim())
              .filter(Boolean)
        : [];
    if (referenceLinks.length > 5) {
        errors.referenceLinks = 'Please provide no more than 5 reference links.';
    } else if (referenceLinks.some((l) => !isUrl(l))) {
        errors.referenceLinks = 'One or more reference links are not valid URLs.';
    }

    const value = {
        name,
        organization,
        email,
        phone,
        projectCategory,
        location,
        preferredDate,
        timeline,
        description,
        referenceLinks,
    };

    return { valid: Object.keys(errors).length === 0, errors, value };
}