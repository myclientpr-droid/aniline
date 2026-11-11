/**
 * Project video sources.
 *
 * Client-safe. No SDK import, no secrets — same contract as `@/lib/cloudinary`.
 *
 * A project's video is one of: a Cloudinary public ID, a YouTube/Vimeo link, or a direct file URL.
 * Admins have pasted links into the public ID field as often as into the link field, so a link is
 * recognised wherever it appears and always wins — that is what lets stored rows heal without a
 * migration. Descriptors hold plain JSON only, because they cross the server/component boundary.
 */

import { buildImageUrl, buildVideoPoster, buildVideoUrl } from '@/lib/cloudinary';

export const VIDEO_KINDS = {
    YOUTUBE: 'youtube',
    VIMEO: 'vimeo',
    CLOUDINARY: 'cloudinary',
    FILE: 'file',
    NONE: 'none',
};

export const VIDEO_RATIOS = {
    WIDE: '16:9',
    TALL: '9:16',
};

/** Delivery width for the detail-page player; Cloudinary caps the rest. */
const PLAYABLE_WIDTH = 1600;

/** 16:9 frames that exist for every upload. `hqdefault` is left out: it is 4:3 with baked-in bars. */
export const YOUTUBE_THUMB_SIZES = ['maxresdefault', 'sddefault', 'mqdefault'];

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID_RE = /^[1-9][0-9]{4,11}$/;
const FILE_EXT_RE = /\.(mp4|webm|m4v|mov|ogv|ogg)(?:\?|#|$)/i;
const URL_RE = /^(?:https?:)?\/\//i;
const HOST_PREFIX_RE = /^(?:www|m|mobile)\./;
const YOUTUBE_HOSTS = new Set([
    'youtube.com',
    'youtu.be',
    'youtube-nocookie.com',
    'music.youtube.com',
    'ytimg.com',
    'i.ytimg.com',
    's.ytimg.com',
]);
const VIMEO_HOSTS = new Set(['vimeo.com', 'player.vimeo.com']);
const YOUTUBE_ID_SEGMENTS = new Set(['shorts', 'embed', 'live', 'v', 'vi']);

function normalizeUrl(raw) {
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!URL_RE.test(value)) return null;
    try {
        return new URL(value.startsWith('//') ? `https:${value}` : value);
    } catch {
        return null;
    }
}

/** `42`, `90s`, `15m`, `1h2m3s` → seconds. Anything unparseable is 0, never a broken embed. */
function parseStartSeconds(value) {
    if (!value) return 0;
    const text = String(value).trim();
    if (/^\d+$/.test(text)) return Number(text);
    const parts = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i.exec(text);
    if (!parts) return 0;
    const [, hours, minutes, seconds] = parts;
    return Number(hours || 0) * 3600 + Number(minutes || 0) * 60 + Number(seconds || 0);
}

/**
 * @param {string} raw - any value from a video field
 * @returns {{ kind: string, id: string, start: number } | null}
 */
export function parseVideoEmbed(raw) {
    const url = normalizeUrl(raw);
    if (!url) return null;

    const host = url.hostname.toLowerCase().replace(HOST_PREFIX_RE, '');
    const segments = url.pathname.split('/').filter(Boolean);

    if (YOUTUBE_HOSTS.has(host)) {
        let id = null;
        if (host === 'youtu.be') id = segments[0];
        else if (host.endsWith('ytimg.com') && segments[0] === 'vi') id = segments[1];
        else if (YOUTUBE_ID_SEGMENTS.has(segments[0])) id = segments[1];
        if (!id) id = url.searchParams.get('v');
        if (!id || !YOUTUBE_ID_RE.test(id)) return null;
        const start = url.searchParams.get('t') || url.searchParams.get('start');
        return { kind: VIDEO_KINDS.YOUTUBE, id, start: parseStartSeconds(start) };
    }

    if (VIMEO_HOSTS.has(host)) {
        // Reverse search: `/groups/<group>/videos/<video>` must yield the video, not the group.
        const id = [...segments]
            .reverse()
            .map((segment) => segment.replace(/\.[A-Za-z0-9]+$/, ''))
            .find((segment) => VIMEO_ID_RE.test(segment));
        if (!id) return null;
        return { kind: VIDEO_KINDS.VIMEO, id, start: 0 };
    }

    return null;
}

/** Player URL that starts playing on arrival. Protocol is pinned to https so a stored `http://` can't mix content. */
export function buildEmbedFrameSrc(embed) {
    if (!embed) return '';
    if (embed.kind === VIDEO_KINDS.YOUTUBE) {
        const params = new URLSearchParams({
            autoplay: '1',
            rel: '0',
            playsinline: '1',
            iv_load_policy: '3',
        });
        if (embed.start > 0) params.set('start', String(embed.start));
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(embed.id)}?${params.toString()}`;
    }
    const params = new URLSearchParams({
        autoplay: '1',
        title: '0',
        byline: '0',
        portrait: '0',
        dnt: '1',
    });
    return `https://player.vimeo.com/video/${encodeURIComponent(embed.id)}?${params.toString()}`;
}

/** Canonical player URL for structured data — no autoplay, no tracking params. */
export function buildEmbedUrl(embed) {
    if (!embed) return '';
    if (embed.kind === VIDEO_KINDS.YOUTUBE) {
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(embed.id)}`;
    }
    return `https://player.vimeo.com/video/${encodeURIComponent(embed.id)}`;
}

export function buildEmbedThumbUrl(embed, size = YOUTUBE_THUMB_SIZES[0]) {
    if (!embed || embed.kind !== VIDEO_KINDS.YOUTUBE) return '';
    return `https://i.ytimg.com/vi/${encodeURIComponent(embed.id)}/${size}.jpg`;
}

/**
 * @param {{ videoUrl?: string, videoPublicId?: string, videoAspectRatio?: string }} project
 * @returns {{ kind: string, aspect: string, embed: { kind: string, id: string, start: number } | null,
 *   publicId: string, playableUrl: string, frameSrc: string, embedUrl: string }}
 */
export function resolveVideoSource(project = {}) {
    const aspect =
        project.videoAspectRatio === VIDEO_RATIOS.TALL ? VIDEO_RATIOS.TALL : VIDEO_RATIOS.WIDE;

    const empty = {
        kind: VIDEO_KINDS.NONE,
        aspect,
        embed: null,
        publicId: '',
        playableUrl: '',
        frameSrc: '',
        embedUrl: '',
    };

    for (const candidate of [project.videoUrl, project.videoPublicId]) {
        const embed = parseVideoEmbed(candidate);
        if (embed) {
            return {
                ...empty,
                kind: embed.kind,
                embed,
                frameSrc: buildEmbedFrameSrc(embed),
                embedUrl: buildEmbedUrl(embed),
            };
        }
    }

    const external = typeof project.videoUrl === 'string' ? project.videoUrl.trim() : '';
    const externalUrl = normalizeUrl(external);
    if (externalUrl && FILE_EXT_RE.test(externalUrl.pathname)) {
        return { ...empty, kind: VIDEO_KINDS.FILE, playableUrl: external };
    }

    const publicId = typeof project.videoPublicId === 'string' ? project.videoPublicId.trim() : '';
    if (publicId && !URL_RE.test(publicId)) {
        return {
            ...empty,
            kind: VIDEO_KINDS.CLOUDINARY,
            publicId,
            playableUrl: buildVideoUrl(publicId, { width: PLAYABLE_WIDTH }),
        };
    }

    return empty;
}

export function posterRatioHeight(width, aspect) {
    return Math.round(aspect === VIDEO_RATIOS.TALL ? (width * 16) / 9 : (width * 9) / 16);
}

/**
 * Poster for a resolved source, always cut to the player's own ratio so the frame never shows bars.
 * Vimeo and file URLs fall back to the project's curated still: a numeric-id Vimeo thumbnail URL
 * returns a placeholder, and an oEmbed lookup would put a third-party dependency on a static page.
 */
export function posterFor(project = {}, video, { width = 1600 } = {}) {
    const height = posterRatioHeight(width, video.aspect);

    if (video.kind === VIDEO_KINDS.CLOUDINARY) {
        return buildVideoPoster(video.publicId, { width, height });
    }
    if (video.kind === VIDEO_KINDS.YOUTUBE) {
        return buildEmbedThumbUrl(video.embed);
    }
    if (video.kind === VIDEO_KINDS.NONE) return '';

    const featuredPublicId = project.featuredImage?.publicId;
    return featuredPublicId ? buildImageUrl(featuredPublicId, { width, height }) : '';
}
