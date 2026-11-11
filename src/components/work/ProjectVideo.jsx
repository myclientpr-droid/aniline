'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import {
    VIDEO_KINDS,
    VIDEO_RATIOS,
    YOUTUBE_THUMB_SIZES,
    buildEmbedThumbUrl,
} from '@/lib/videoSources';

// An uncapped 9:16 box in this site's container would be roughly 1150x2050px, i.e. a page-long
// black hole. Capped, it reads as a phone reel inside a film bezel.
const BEZEL_CLASSES = {
    [VIDEO_RATIOS.WIDE]: 'w-full',
    [VIDEO_RATIOS.TALL]: 'mx-auto w-full max-w-[26rem]',
};

const FRAME_CLASSES = {
    [VIDEO_RATIOS.WIDE]: 'aspect-[16/9]',
    [VIDEO_RATIOS.TALL]: 'aspect-[9/16]',
};

const PLAYER_NAMES = {
    [VIDEO_KINDS.YOUTUBE]: 'YouTube',
    [VIDEO_KINDS.VIMEO]: 'Vimeo',
};

/**
 * A project's video, in its own bezel.
 *
 * Embedded sources render a poster and a play button and only take the third-party iframe after a
 * click, so a page view downloads nothing from YouTube or Vimeo. Uploaded files play natively.
 *
 * @param {{
 *   video: {
 *     kind: string,
 *     aspect: string,
 *     embed: { kind: string, id: string, start: number } | null,
 *     playableUrl: string,
 *     frameSrc: string,
 *   },
 *   title: string,
 *   posterSrc?: string,
 *   posterIsLcpCandidate?: boolean,
 *   preferPoster?: boolean,
 * }} props
 */
export default function ProjectVideo({
    video,
    title,
    posterSrc = '',
    posterIsLcpCandidate = false,
    preferPoster = false,
}) {
    // Holding a frame src *is* the "playing" flag — one value cannot disagree with itself.
    const [frameSrc, setFrameSrc] = useState('');
    const [thumbIndex, setThumbIndex] = useState(0);
    const iframeRef = useRef(null);
    const posterRef = useRef(null);

    const player = PLAYER_NAMES[video.kind];
    // YouTube's own thumbnails are 16:9 letterboxed for a phone reel and say nothing about the film,
    // so a page that supplied a curated still keeps it. Without one the ladder is still the fallback.
    const usePlatformLadder =
        video.kind === VIDEO_KINDS.YOUTUBE && !(preferPoster && posterSrc);
    const thumbs = usePlatformLadder ? YOUTUBE_THUMB_SIZES : [];
    const poster = thumbs.length
        ? buildEmbedThumbUrl(video.embed, thumbs[thumbIndex])
        : posterSrc;

    const advanceThumb = () => {
        if (thumbs.length < 2) return;
        setThumbIndex((index) => Math.min(index + 1, thumbs.length - 1));
    };

    // A poster that fails before React attaches `onError` never reports it.
    useEffect(() => {
        const node = posterRef.current;
        if (node && node.complete && node.naturalWidth === 0) advanceThumb();
    });

    return (
        <div className={`frame-cinema ${BEZEL_CLASSES[video.aspect] ?? BEZEL_CLASSES[VIDEO_RATIOS.WIDE]}`}>
            <div
                className={`relative overflow-hidden rounded-lg bg-navy-dark ${FRAME_CLASSES[video.aspect] ?? FRAME_CLASSES[VIDEO_RATIOS.WIDE]}`}
            >
                {player ? (
                    frameSrc ? (
                        <iframe
                            ref={iframeRef}
                            src={frameSrc}
                            title={`${title} — video`}
                            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            onLoad={() => iframeRef.current?.focus()}
                            className="absolute inset-0 h-full w-full rounded-lg border-0"
                        />
                    ) : (
                        <>
                            {poster ? (
                                // ytimg thumbnails are static JPEGs on Google's own CDN. Routing them
                                // through the optimizer would make this origin a proxy for a
                                // third-party host's whole namespace, for a file that is already warm.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    ref={posterRef}
                                    src={poster}
                                    alt=""
                                    decoding="async"
                                    loading={posterIsLcpCandidate ? 'eager' : 'lazy'}
                                    fetchPriority={posterIsLcpCandidate ? 'high' : 'low'}
                                    onError={advanceThumb}
                                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-gradient-to-br from-navy to-navy-dark"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => setFrameSrc(video.frameSrc)}
                                className="group absolute inset-0 z-[1] flex items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                            >
                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/95 text-navy-dark shadow-lg transition-transform duration-300 ease-[var(--ease-cinematic)] group-hover:scale-110">
                                    <Play
                                        className="h-7 w-7 translate-x-[2px]"
                                        aria-hidden="true"
                                        fill="currentColor"
                                    />
                                </span>
                                <span className="sr-only">{`Play ${title} on ${player}`}</span>
                                <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.18em] text-white/70">
                                    <span className="rec-dot" aria-hidden="true" />
                                    {player}
                                </span>
                            </button>
                        </>
                    )
                ) : (
                    <video
                        className="absolute inset-0 h-full w-full object-contain"
                        controls
                        playsInline
                        preload="metadata"
                        poster={posterSrc || undefined}
                    >
                        <source src={video.playableUrl} />
                        Your browser does not support embedded video.
                    </video>
                )}
            </div>
        </div>
    );
}
