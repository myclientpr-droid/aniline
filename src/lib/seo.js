import { SITE } from '@/lib/site';

/**
 * Build a Next.js Metadata object for a page.
 * @param {object} opts
 * @param {string} opts.title - Page title (without site name)
 * @param {string} [opts.description] - Meta description
 * @param {string} [opts.path] - Path beginning with "/" (e.g. "/about")
 * @param {string} [opts.image] - Absolute or /-prefixed OG image
 * @param {boolean} [opts.noIndex] - If true, sets robots to noindex
 * @returns {import('next').Metadata}
 */
export function buildMetadata({
    title,
    description = SITE.description,
    path = '/',
    image = '/og-default.jpg',
    noIndex = false,
} = {}) {
    const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} \u2014 ${SITE.tagline}`;
    const url = `${SITE.url}${path}`;
    const ogImage = image.startsWith('http') ? image : `${SITE.url}${image}`;

    return {
        title: fullTitle,
        description,
        metadataBase: new URL(SITE.url),
        alternates: {
            canonical: path,
        },
        robots: noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE.name,
            locale: SITE.locale,
            type: 'website',
            images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
    };
}

/**
 * Organization JSON-LD. Only include fields we can support factually.
 */
export function organizationJsonLd() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        foundingDate: SITE.founded,
        areaServed: SITE.location.region,
    };

    if (SITE.contact.email) data.email = SITE.contact.email;
    if (SITE.contact.phone) data.telephone = SITE.contact.phone;

    const sameAs = Object.values(SITE.social).filter(Boolean);
    if (sameAs.length > 0) data.sameAs = sameAs;

    return data;
}


/* ------------------------------------------------------------------ */
/* Additional JSON-LD helpers                                          */
/* ------------------------------------------------------------------ */

/**
 * Build a BreadcrumbList JSON-LD.
 * @param {Array<{ name: string, path: string }>} crumbs - Order: home first.
 * @returns {object}
 */
export function breadcrumbJsonLd(crumbs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: `${SITE.url}${c.path}`,
        })),
    };
}

/**
 * Build a Service JSON-LD for a service detail page.
 * Only include fields actually present on the record.
 * @param {{ title: string, slug: string, description?: string, shortDescription?: string }} service
 */
export function serviceJsonLd(service) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.shortDescription || service.description || undefined,
        url: `${SITE.url}/services/${service.slug}`,
        provider: {
            '@type': 'Organization',
            name: SITE.name,
            url: SITE.url,
        },
        areaServed: SITE.location.region,
    };
}

/**
 * Build a VideoObject JSON-LD. Only call when the project actually has a video.
 * @param {{
 *   title: string,
 *   slug: string,
 *   shortDescription?: string,
 *   fullDescription?: string,
 *   videoPublicId: string,
 *   videoUrl: string,
 *   posterUrl?: string,
 *   uploadDate?: string,
 * }} project
 */
export function videoObjectJsonLd(project) {
    const url = `${SITE.url}/work/${project.slug}`;
    return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: project.title,
        description:
            project.shortDescription || project.fullDescription || undefined,
        thumbnailUrl: project.posterUrl ? [project.posterUrl] : undefined,
        uploadDate: project.uploadDate || undefined,
        contentUrl: project.videoUrl || undefined,
        embedUrl: url,
        publisher: {
            '@type': 'Organization',
            name: SITE.name,
            url: SITE.url,
        },
    };
}

/**
 * Serialize JSON-LD for embedding in <script type="application/ld+json">.
 * Strips undefined fields so the payload stays clean.
 * @param {object} data
 * @returns {string}
 */
export function stringifyJsonLd(data) {
    return JSON.stringify(data, (_, v) => (v === undefined ? undefined : v));
}