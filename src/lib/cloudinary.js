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
 * A public ID never carries a protocol. When one does, an admin pasted a video link into the
 * Cloudinary field, and building a URL from it would 404 as "no supported format" in the player.
 * `@/lib/videoSources` recognises those links; the builders just refuse to mangle them.
 */
function isPlayablePublicId(value) {
    return typeof value === 'string' && value.length > 0 && !/^(?:https?:)?\/\//i.test(value);
}

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

    // Cloudinary rejects c_fit combined with g_auto (HTTP 400), so only apply
    // gravity for the crops that support it.
    const gravityCrops = new Set(['fill', 'lfill', 'thumb', 'crop', 'auto']);
    const usesGravity = gravityCrops.has(crop);

    const transforms = [
        `f_${format}`,
        `q_${quality}`,
        width ? `w_${width}` : null,
        height ? `h_${height}` : null,
        width || height ? `c_${crop}` : null,
        (width || height) && usesGravity ? `g_${gravity}` : null,
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
    if (!isPlayablePublicId(publicId)) return '';
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
 * @param {number} [opts.height] - crops to a target ratio instead of trusting the source ratio
 * @returns {string}
 */
export function buildVideoPoster(publicId, opts = {}) {
    if (!isPlayablePublicId(publicId)) return '';
    const { width = 1280, height } = opts;
    const transforms = ['so_0', `w_${width}`];
    if (height) transforms.push(`h_${height}`, 'c_fill', 'g_auto');
    else transforms.push('c_fill');
    transforms.push('q_auto:good', 'f_auto');
    return `${BASE}/video/upload/${transforms.join(',')}/${publicId}.jpg`;
}