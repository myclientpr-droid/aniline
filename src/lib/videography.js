/**
 * Videography adapters.
 *
 * Client-safe. No SDK import, no secrets — same contract as `@/lib/cloudinary`.
 *
 * One place where a film becomes a source, a poster and a duration string, so the validator, both
 * public pages, the tile, the featured band and the OG builder cannot drift apart.
 */

import { buildImageUrl } from '@/lib/cloudinary';
import { VIDEO_RATIOS, posterFor, posterRatioHeight, resolveVideoSource } from '@/lib/videoSources';

/**
 * A film stores the same two video fields the player reads, under different names.
 * @param {{ videoUrl?: string, aspectRatio?: string }} film
 */
export function resolveFilmSource(film) {
    return resolveVideoSource({
        videoUrl: film?.videoUrl,
        videoAspectRatio: film?.aspectRatio,
    });
}

/**
 * The owner's curated still, cut to the player's own ratio. Cloudinary only, because the result is
 * handed to `next/image` — `remotePatterns` allow-lists nothing else.
 * @param {{ poster?: { publicId?: string } | null }} film
 * @param {{ aspect?: string }} video
 * @param {{ width?: number }} [opts]
 */
export function filmStill(film, video, { width = 640 } = {}) {
    const publicId = film?.poster?.publicId;
    if (!publicId) return '';
    const aspect = video?.aspect ?? VIDEO_RATIOS.WIDE;
    return buildImageUrl(publicId, { width, height: posterRatioHeight(width, aspect) });
}

/**
 * What the player should show before anyone presses play: the curated still if there is one,
 * otherwise whatever the platform can offer.
 *
 * May return an `i.ytimg.com` URL, so this is for `<img>`/iframe use only — tiles call `filmStill`.
 * `posterFor` reads the still off `featuredImage`, hence the rename here rather than at four call sites.
 */
export function filmPoster(film, video, { width = 1600 } = {}) {
    return filmStill(film, video, { width }) || posterFor({ featuredImage: film?.poster }, video, { width });
}

/**
 * Seconds → the runtime as a viewer writes it: 253 → '4:13', 3735 → '1:02:15'. Unset renders ''.
 * @param {number|null|undefined} seconds
 */
export function formatDuration(seconds) {
    const total = Math.round(Number(seconds));
    if (!Number.isInteger(total) || total <= 0) return '';
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = String(total % 60).padStart(2, '0');
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`;
}

/** Seconds → the ISO 8601 form Google's VideoObject expects: 253 → 'PT4M13S'. */
export function iso8601Duration(seconds) {
    const total = Math.round(Number(seconds));
    if (!Number.isInteger(total) || total <= 0) return '';
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const body = [hours ? `${hours}H` : '', minutes ? `${minutes}M` : '', secs ? `${secs}S` : ''].join('');
    return `PT${body || '0S'}`;
}

/**
 * '4:13' | '1:02:15' | '253' | '74m' | '1h2m3s' → seconds.
 *
 * Unparseable and absent are both `null`, never 0 — the validator has to be able to tell a mistyped
 * duration from an empty one, and a stored 0 would fail the model's `min: 1`.
 */
export function parseDurationSeconds(raw) {
    if (raw === null || raw === undefined) return null;
    const text = String(raw).trim().toLowerCase();
    if (!text) return null;

    if (/^\d+(?::\d{1,2}){1,2}$/.test(text)) {
        const parts = text.split(':').map(Number);
        return toSeconds(parts.length === 2 ? [0, ...parts] : parts);
    }
    if (/^\d+$/.test(text)) return toSeconds([0, 0, Number(text)]);

    const parts = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(text);
    if (!parts || !(parts[1] || parts[2] || parts[3])) return null;
    return toSeconds([Number(parts[1] || 0), Number(parts[2] || 0), Number(parts[3] || 0)]);
}

function toSeconds([hours, minutes, seconds]) {
    const total = hours * 3600 + minutes * 60 + seconds;
    return Number.isFinite(total) && total > 0 ? total : null;
}
