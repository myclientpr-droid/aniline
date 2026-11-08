import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import {
    getPublishedProjectBySlug,
    listPublishedProjectSlugs,
} from '@/lib/data/projects';
import {
    buildImageUrl,
    buildVideoUrl,
    buildVideoPoster,
} from '@/lib/cloudinary';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';
import {
    breadcrumbJsonLd,
    creativeWorkJsonLd,
    videoObjectJsonLd,
    webPageJsonLd,
} from '@/lib/schema';

export async function generateStaticParams() {
    try {
        const slugs = await listPublishedProjectSlugs();
        return slugs.map((s) => ({ slug: s.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await Promise.resolve(params);
    const project = await getPublishedProjectBySlug(slug).catch(() => null);
    if (!project) {
        return buildMetadata({
            title: 'Project not found',
            path: `/work/${slug}`,
            noIndex: true,
        });
    }
    // The category goes into the title only when it is not already part of the project title.
    const withCategory =
        project.seoTitle ||
        (project.category && !project.title.toLowerCase().includes(project.category.toLowerCase())
            ? `${project.title} \u2014 ${project.category}`
            : project.title);
    return buildMetadata({
        title: `${withCategory} | ${SITE.name}`,
        description: project.seoDescription || project.shortDescription || undefined,
        path: `/work/${project.slug}`,
        // The opengraph-image route for this segment composes the featured still into the card.
        ogType: 'video.other',
    });
}

export default async function ProjectPage({ params }) {
    const { slug } = await Promise.resolve(params);
    const project = await getPublishedProjectBySlug(slug).catch(() => null);
    if (!project) notFound();

    const {
        title,
        category,
        year,
        location,
        client,
        shortDescription,
        fullDescription,
        featuredImage,
        gallery = [],
        videoPublicId,
        servicesProvided = [],
    } = project;

    const heroSrc = featuredImage?.publicId
        ? buildImageUrl(featuredImage.publicId, { width: 1920, crop: 'fill' })
        : null;
    const posterSrc = videoPublicId
        ? buildVideoPoster(videoPublicId, { width: 1600 })
        : heroSrc;
    const gallerySrcs = gallery
        .filter((item) => item.publicId)
        .slice(0, 10)
        .map((item) => buildImageUrl(item.publicId, { width: 1280, crop: 'fill' }));

    const pagePath = `/work/${slug}`;
    const pageNodes = [
        webPageJsonLd({
            path: pagePath,
            name: title,
            description: shortDescription || undefined,
            primaryImage: posterSrc || undefined,
            about: { '@id': `${SITE.url}${pagePath}#work` },
        }),
        breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Our Work', path: '/work' },
            { name: title, path: pagePath },
        ]),
        {
            ...creativeWorkJsonLd({
                title,
                slug,
                shortDescription,
                category,
                year,
                location,
                client,
                servicesProvided,
                images: [heroSrc, ...gallerySrcs].filter(Boolean),
            }),
            '@context': 'https://schema.org',
        },
    ];

    if (videoPublicId) {
        pageNodes.push({
            ...videoObjectJsonLd({
                title,
                slug,
                shortDescription,
                fullDescription,
                videoUrl: buildVideoUrl(videoPublicId, { width: 1600 }),
                posterUrl: posterSrc,
                uploadDate: project.createdAt
                    ? new Date(project.createdAt).toISOString()
                    : project.updatedAt
                      ? new Date(project.updatedAt).toISOString()
                      : undefined,
            }),
            '@context': 'https://schema.org',
        });
    }

    return (
        <>
            <JsonLd data={pageNodes} />
            {/* Hero media */}
            <section className="relative bg-navy-dark text-white">
                <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
                    {heroSrc ? (
                        <Image
                            src={heroSrc}
                            alt={featuredImage.alt || title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-dark" aria-hidden="true" />
                    )}
                    <div className="cinematic-overlay absolute inset-0" aria-hidden="true" />
                    {/* The still is the content of this band, so the depth stack stays over it rather
                        than replacing it. Grain only: it paints through a pseudo-element, so it can
                        never win the LCP that belongs to this project's image. A full-bleed
                        `background-image` layer here did, on projects without a featured still. */}
                    <div className="stage-layer stage__grain" aria-hidden="true" />

                    {/* Not `relative`: the caption is absolutely positioned against the media box, and
                        a positioned Container would re-anchor it to a zero-height box. It still paints
                        above the grain — both are positioned, and it comes later in DOM order. */}
                    <Container>
                        <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-16">
                            <Link
                                href="/work"
                                className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                Back to work
                            </Link>
                            {category && (
                                <p className="rise-load text-orange text-xs font-semibold uppercase tracking-[0.18em] mb-3">
                                    <span className="rec-dot" aria-hidden="true" />
                                    {category}
                                </p>
                            )}
                            <h1 className="rise-load-shift text-white max-w-4xl text-balance">{title}</h1>
                            {(year || location || client) && (
                                <p className="rise-load rise-d1 text-white/70 text-sm mt-4 uppercase tracking-wider">
                                    {[client, location, year].filter(Boolean).join(' \u00b7 ')}
                                </p>
                            )}
                        </div>
                    </Container>
                </div>
            </section>

            {/* Video (if any) */}
            {videoPublicId && (
                <section className="stage">
                    <div className="stage-layer stage__pool" aria-hidden="true" />
                    <Container className="relative">
                        <div className="rise py-10 md:py-16">
                            <div className="frame-cinema">
                                <video
                                    className="w-full h-auto rounded-lg"
                                    controls
                                    playsInline
                                    preload="metadata"
                                    poster={buildVideoPoster(videoPublicId, { width: 1600 })}
                                >
                                    <source src={buildVideoUrl(videoPublicId, { width: 1600 })} type="video/mp4" />
                                    Your browser does not support embedded video.
                                </video>
                            </div>
                        </div>
                    </Container>
                </section>
            )}

            {/* Body */}
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

                        <aside className="rise rise-3 md:col-span-4 md:col-start-9">
                            <div className="elevate-3 rounded-lg border border-navy/10 bg-white p-6">
                                <h2 className="text-navy text-sm font-semibold uppercase tracking-widest">
                                    Project details
                                </h2>
                                <dl className="mt-5 space-y-4 text-sm">
                                    {client && (
                                        <div>
                                            <dt className="text-slate">Client</dt>
                                            <dd className="text-navy mt-1">{client}</dd>
                                        </div>
                                    )}
                                    {location && (
                                        <div>
                                            <dt className="text-slate">Location</dt>
                                            <dd className="text-navy mt-1">{location}</dd>
                                        </div>
                                    )}
                                    {year && (
                                        <div>
                                            <dt className="text-slate">Year</dt>
                                            <dd className="text-navy mt-1">{year}</dd>
                                        </div>
                                    )}
                                    {servicesProvided.length > 0 && (
                                        <div>
                                            <dt className="text-slate">Services provided</dt>
                                            <dd className="text-navy mt-1">
                                                <ul className="space-y-1">
                                                    {servicesProvided.map((s) => (
                                                        <li key={s}>{s}</li>
                                                    ))}
                                                </ul>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                                <div className="mt-6">
                                    <Button href="/start-a-project" variant="primary" className="w-full">
                                        Start a similar project
                                    </Button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </Container>
            </section>

            {/* Gallery */}
            {gallery.length > 0 && (
                <section className="section-padding bg-light">
                    <Container>
                        <span aria-hidden="true" className="depth-rule mb-4 block" />
                        <h2 className="text-navy mb-8">Gallery</h2>
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {gallery.map((item, i) => {
                                const src = buildImageUrl(item.publicId, { width: 800, crop: 'fill' });
                                return (
                                    <li key={item.publicId || i} className={`rise rise-${(i % 3) + 1}`}>
                                        <div className="frame-cinema relative aspect-[4/3] overflow-hidden rounded-lg">
                                            <Image
                                                src={src}
                                                alt={item.alt || `${title} \u2014 image ${i + 1}`}
                                                fill
                                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Container>
                </section>
            )}

            <CtaSection />
        </>
    );
}