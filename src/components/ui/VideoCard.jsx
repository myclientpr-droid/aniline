import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { TILE_ASPECT_CLASSES } from '@/components/ui/ProjectCard';
import { VIDEO_RATIOS } from '@/lib/videoSources';
import { filmStill, formatDuration, resolveFilmSource } from '@/lib/videography';

/**
 * One film in the archive grid. A link, not a player: the tile is a still and the film plays on its
 * own page, so the archive downloads nothing from YouTube.
 *
 * @param {{
 *   film: { title: string, slug: string, shortDescription?: string, category?: string, year?: number,
 *     location?: string, durationSeconds?: number|null, videoUrl?: string, aspectRatio?: string,
 *     poster?: { publicId?: string, alt?: string } | null },
 * }} props
 */
export default function VideoCard({ film }) {
    const { title, slug, shortDescription, category, year, location, poster } = film;

    const video = resolveFilmSource(film);
    const portrait = video.aspect === VIDEO_RATIOS.TALL;
    const durationText = formatDuration(film.durationSeconds);
    const still = filmStill(film, video);

    return (
        <article className={portrait ? 'mx-auto max-w-[20rem]' : ''}>
            {/* `group` sits on the link, not the article: `group-focus-visible:` only fires on the
                element that can actually take focus, and the disc is meant for keyboard users too. */}
            <Link
                href={`/videography/${slug}`}
                data-tilt=""
                className="group tilt-card specular elevate-2 block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
            >
                <div
                    className={`relative w-full bg-navy-dark overflow-hidden rounded-lg ${TILE_ASPECT_CLASSES[video.aspect] ?? TILE_ASPECT_CLASSES[VIDEO_RATIOS.WIDE]}`}
                >
                    {still ? (
                        <Image
                            src={still}
                            alt={poster?.alt || title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center text-white/30 text-sm tracking-widest uppercase"
                        >
                            AniLine
                        </div>
                    )}

                    {/* z-[3]: `.specular::after` paints its sheen at z-index 2, so a lower overlay is
                        polished over. Not `tile-dim` — that class is the gallery's sibling rack-focus
                        and reacts to `:hover` on the box itself, not on the card. */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 z-[3] flex items-center justify-center bg-navy-dark/25 opacity-0 transition-opacity duration-300 ease-[var(--ease-cinematic)] group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange/95 text-navy-dark shadow-lg">
                            <Play
                                className="h-6 w-6 translate-x-[2px]"
                                aria-hidden="true"
                                fill="currentColor"
                            />
                        </span>
                    </span>

                    {durationText && (
                        <span className="absolute bottom-2 right-2 z-[3] rounded bg-navy-dark/80 px-2 py-1 text-xs font-semibold tabular-nums text-white">
                            {durationText}
                        </span>
                    )}
                </div>

                <div className="tilt-lift-2 px-6 pb-6 pt-5">
                    {category && (
                        <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                            {category}
                        </p>
                    )}
                    <h3 className="text-navy text-xl leading-snug group-hover:text-navy-dark">
                        {title}
                    </h3>
                    {shortDescription && (
                        <p className="text-slate text-sm mt-2 line-clamp-2">{shortDescription}</p>
                    )}
                    {(year || location) && (
                        <p className="text-slate text-xs mt-3 uppercase tracking-wider">
                            {[location, year].filter(Boolean).join(' \u00b7 ')}
                        </p>
                    )}
                </div>
            </Link>
        </article>
    );
}
