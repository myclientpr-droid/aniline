import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProjectVideo from '@/components/work/ProjectVideo';
import { VIDEO_KINDS } from '@/lib/videoSources';
import { filmPoster, formatDuration, resolveFilmSource } from '@/lib/videography';

/**
 * The featured film — this is the page's hero, so it owns the page's `h1`.
 *
 * Rendered inside the page's own stage band and Container: the depth stack belongs to the section,
 * the bezel belongs to `ProjectVideo`, and this component is only the type between them.
 *
 * A single vertical stack rather than an 8/4 grid, because a 9:16 reel is capped at 26rem by the
 * player and would leave eight columns of empty stage beside it.
 *
 * @param {{
 *   film: { title: string, slug: string, category?: string, year?: number, durationSeconds?: number|null,
 *     videoUrl?: string, aspectRatio?: string, poster?: { publicId?: string, alt?: string } | null },
 *   hero: { eyebrow: string, title: string, subheading?: string },
 *   bandLabel: string,
 * }} props
 */
export default function FeaturedFilm({ film, hero, bandLabel }) {
    const video = resolveFilmSource(film);
    if (video.kind === VIDEO_KINDS.NONE) return null;

    // The band's poster is the page's hero media, so it is loaded eagerly and hinted high.
    const posterSrc = filmPoster(film, video, { width: 1280 });
    const meta = [film.category, film.year, formatDuration(film.durationSeconds)].filter(Boolean);

    return (
        <div>
            <div className="max-w-3xl">
                <p className="rise-load-shift text-orange text-xs font-semibold uppercase tracking-[0.18em]">
                    <span className="rec-dot" aria-hidden="true" />
                    {bandLabel}
                </p>

                {/* Transform-only entrances: the h1 is the LCP candidate and an opacity fade on it
                    would delay the metric by the whole animation. */}
                <h1 className="rise-load-shift mt-4 text-white text-balance">{hero.title}</h1>

                {hero.subheading && (
                    <p className="rise-load-shift rise-d1 text-white/75 mt-6 text-base md:text-lg">
                        {hero.subheading}
                    </p>
                )}
            </div>

            <div className="rise rise-d2 mt-10 md:mt-14">
                <ProjectVideo
                    video={video}
                    title={film.title}
                    posterSrc={posterSrc}
                    posterIsLcpCandidate
                    preferPoster
                />

                <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    {meta.length > 0 && (
                        <p className="text-white/70 text-sm uppercase tracking-wider">
                            {meta.join(' \u00b7 ')}
                        </p>
                    )}
                    <Link
                        href={`/videography/${film.slug}`}
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-orange"
                    >
                        {film.title}
                        <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-cinematic)] group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                        <span className="sr-only"> film page</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
