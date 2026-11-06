/**
 * Cloudinary URL builders.
 *
 * Client-safe. No SDK import, no secrets.
 * Server-only signing lives in `@/lib/cloudinary-server`.
 */

const CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    'demo';

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}`;

/**
 * Build an optimized image URL.
 * @param {string} publicId - Cloudinary public ID (no extension)
 * @param {object} [opts]
 * @param {number} [opts.width]
 * @param {number} [opts.height]
 * @param {string} [opts.crop='fill']
 * @param {string} [opts.gravity='auto']
 * @param {string} [opts.quality='auto:good']
 * @param {string} [opts.format='auto']
 * @returns {string}
 */
export function buildImageUrl(publicId, opts = {}) {
    if (!publicId) return '';
    const {
        width,
        height,
        crop = 'fill',
        gravity = 'auto',
        quality = 'auto:good',
        format = 'auto',
    } = opts;

    const transforms = [
        `f_${format}`,
        `q_${quality}`,
        width ? `w_${width}` : null,
        height ? `h_${height}` : null,
        width || height ? `c_${crop}` : null,
        width || height ? `g_${gravity}` : null,
    ].filter(Boolean);

    return `${BASE}/image/upload/${transforms.join(',')}/${publicId}`;
}

/**
 * Build a responsive srcset string.
 * @param {string} publicId
 * @param {number[]} widths
 * @returns {string}
 */
export function buildResponsiveImage(publicId, widths = [640, 960, 1280, 1600, 1920]) {
    if (!publicId) return '';
    return widths
        .map((w) => `${buildImageUrl(publicId, { width: w })} ${w}w`)
        .join(', ');
}

/**
 * Build an optimized video URL.
 * @param {string} publicId
 * @param {object} [opts]
 * @param {number} [opts.width]
 * @param {string} [opts.quality='auto:good']
 * @returns {string}
 */
export function buildVideoUrl(publicId, opts = {}) {
    if (!publicId) return '';
    const { width, quality = 'auto:good' } = opts;
    const transforms = [`f_auto`, `q_${quality}`, width ? `w_${width}` : null]
        .filter(Boolean)
        .join(',');
    return `${BASE}/video/upload/${transforms}/${publicId}`;
}

/**
 * Build a poster image for a video. Uses Cloudinary's frame extraction.
 * @param {string} publicId
 * @param {object} [opts]
 * @param {number} [opts.width=1280]
 * @returns {string}
 */
export function buildVideoPoster(publicId, opts = {}) {
    if (!publicId) return '';
    const { width = 1280 } = opts;
    return `${BASE}/video/upload/so_0,w_${width},c_fill,q_auto:good,f_auto/${publicId}.jpg`;
}