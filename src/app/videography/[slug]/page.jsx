import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import ProjectVideo from '@/components/work/ProjectVideo';
import { getPublishedVideoBySlug, listPublishedVideoSlugs } from '@/lib/data/videos';
import { VIDEO_KINDS } from '@/lib/videoSources';
import { filmPoster, formatDuration, iso8601Duration, resolveFilmSource } from '@/lib/videography';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { breadcrumbJsonLd, videoObjectJsonLd, webPageJsonLd } from '@/lib/schema';

export async function generateStaticParams() {
    try {
        const slugs = await listPublishedVideoSlugs();
        return slugs.map((s) => ({ slug: s.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await Promise.resolve(params);
    const film = await getPublishedVideoBySlug(slug).catch(() => null);
    if (!film) {
        return buildMetadata({
            title: 'Film not found',
            path: `/videography/${slug}`,
            noIndex: true,
        });
    }
    // The category goes into the title only when it is not already part of the film title.
    const withCategory =
        film.seoTitle ||
        (film.category && !film.title.toLowerCase().includes(film.category.toLowerCase())
            ? `${film.title} \u2014 ${film.category}`
            : film.title);
    return buildMetadata({
        title: `${withCategory} | ${SITE.name}`,
        description: film.seoDescription || film.shortDescription || undefined,
        path: `/videography/${film.slug}`,
        // The opengraph-image route for this segment composes the poster still into the card.
        ogType: 'video.other',
    });
}

export default async function VideographyDetailPage({ params }) {
    const { slug } = await Promise.resolve(params);
    const film = await getPublishedVideoBySlug(slug).catch(() => null);
    if (!film) notFound();

    const {
        title,
        category,
        year,
        location,
        client,
        shortDescription,
        fullDescription,
        durationSeconds,
    } = film;

    const video = resolveFilmSource(film);
    const posterSrc = filmPoster(film, video);
    const runtime = formatDuration(durationSeconds);
    const pagePath = `/videography/${slug}`;

    const crumbs = [
        { name: 'Home', path: '/' },
        { name: 'Videography', path: '/videography' },
        { name: title, path: pagePath },
    ];

    const meta = [client, location, year, runtime].filter(Boolean);
    const credits = [
        ['Duration', runtime],
        ['Category', category],
        ['Year', year ? String(year) : ''],
        ['Location', location],
        ['Client', client],
    ].filter(([, value]) => Boolean(value));

    const pageNodes = [
        webPageJsonLd({
            path: pagePath,
            name: title,
            description: shortDescription || undefined,
            primaryImage: posterSrc || undefined,
        }),
        breadcrumbJsonLd(crumbs),
    ];

    if (video.kind !== VIDEO_KINDS.NONE) {
        pageNodes.push({
            ...videoObjectJsonLd({
                title,
                slug,
                path: pagePath,
                shortDescription,
                fullDescription,
                // No contentUrl: a platform link is a page, not fetchable media — `embedUrl` covers it.
                embedUrl: video.embedUrl,
                posterUrl: posterSrc,
                duration: iso8601Duration(durationSeconds) || undefined,
                // The day the film went up on this site. The platform's own date is not observable
                // from a link, and a wrong uploadDate is a manual-action risk.
                uploadDate: film.createdAt
                    ? new Date(film.createdAt).toISOString()
                    : film.updatedAt
                      ? new Date(film.updatedAt).toISOString()
                      : undefined,
            }),
            '@context': 'https://schema.org',
        });
    }

    return (
        <>
            <JsonLd data={pageNodes} />

            <section className="stage section-padding text-white">
                <div className="stage-layer stage__pool" aria-hidden="true" />
                <div className="stage-layer stage__beam" aria-hidden="true" />
                <div className="stage-layer stage__floor" aria-hidden="true" />
                <div className="stage-layer stage__grain" aria-hidden="true" />
                <div className="stage-layer stage__vignette" aria-hidden="true" />
                <div className="stage-layer stage__seam" aria-hidden="true" />

                <Container className="relative">
                    <Breadcrumb items={crumbs} tone="dark" className="mb-8" />

                    <div className="max-w-3xl">
                        {category && (
                            <p className="rise-load-shift text-orange text-xs font-semibold uppercase tracking-[0.18em]">
                                <span className="rec-dot" aria-hidden="true" />
                                {category}
                            </p>
                        )}
                        <h1 className="rise-load-shift mt-4 text-white text-balance">{title}</h1>
                        {meta.length > 0 && (
                            <p className="rise-load-shift rise-d1 text-white/70 text-sm mt-4 uppercase tracking-wider">
                                {meta.join(' \u00b7 ')}
                            </p>
                        )}
                    </div>

                    {/* The player sits in this band, under the h1: the film is what the page is
                        about, so nothing else gets to be the subject — or the LCP. */}
                    {video.kind !== VIDEO_KINDS.NONE && (
                        <div className="rise rise-d2 mt-10">
                            <ProjectVideo
                                video={video}
                                title={title}
                                posterSrc={posterSrc}
                                posterIsLcpCandidate
                                preferPoster
                            />
                        </div>
                    )}
                </Container>
            </section>

            <section className="section-padding bg-white">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="rise md:col-span-7">
                            {shortDescription && (
                                <p className="text-navy text-lg md:text-xl leading-relaxed mb-6">
                                    {shortDescription}
                                </p>
                            )}
                            {fullDescription && (
                                <div className="text-slate space-y-4 whitespace-pre-line">
                                    {fullDescription}
                                </div>
                            )}
                        </div>

                        {credits.length > 0 && (
                            <aside className="rise rise-3 md:col-span-4 md:col-start-9">
                                <div className="elevate-3 rounded-lg border border-navy/10 bg-white p-6">
                                    <h2 className="text-navy text-sm font-semibold uppercase tracking-widest">
                                        Film notes
                                    </h2>
                                    <dl className="mt-5 space-y-4 text-sm">
                                        {credits.map(([label, value]) => (
                                            <div key={label}>
                                                <dt className="text-slate">{label}</dt>
                                                <dd className="text-navy mt-1">{value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </aside>
                        )}
                    </div>
                </Container>
            </section>

            <CtaSection
                eyebrow="Videography"
                title="Have a film to make?"
                description="Tell us the dates, the deliverables and where it will be seen — we will come back with scope, schedule and cost."
                primaryLabel="Hire a videographer"
                primaryHref="/videographer"
                secondaryLabel="All films"
                secondaryHref="/videography"
            />
        </>
    );
}
