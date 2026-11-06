import { isSlug } from '@/lib/validators';

/**
 * Convert a string into a URL-safe slug.
 * @param {string} input
 * @returns {string}
 */
export function slugify(input) {
    if (typeof input !== 'string') return '';
    return input
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
}

/**
 * Ensure a slug is unique within a collection.
 * @param {string} base - Candidate slug
 * @param {(slug: string) => Promise<boolean>} exists - Async checker
 * @returns {Promise<string>}
 */
export async function uniqueSlug(base, exists) {
    const clean = isSlug(base) ? base : slugify(base);
    if (!clean) throw new Error('Invalid slug source');
    if (!(await exists(clean))) return clean;
    for (let i = 2; i < 1000; i += 1) {
        const candidate = `${clean}-${i}`;
        if (!(await exists(candidate))) return candidate;
    }
    throw new Error('Could not generate unique slug');
}