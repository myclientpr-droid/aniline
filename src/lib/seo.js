import { SITE } from '@/lib/site';

/**
 * Metadata only. Structured data lives in `@/lib/schema` so the two can be reasoned about
 * separately — a page's head and its JSON-LD graph rarely change together.
 */

const ROBOTS = {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
    },
};

const NO_ROBOTS = { index: false, follow: false, googleBot: { index: false, follow: false } };

/**
 * Root metadata. `metadataBase` lives here and nowhere else, so relative canonicals and
 * file-convention OG images all resolve against the same origin.
 * @returns {import('next').Metadata}
 */
export function siteMetadata() {
    return {
        metadataBase: new URL(SITE.url),
        // Only a default: every page passes its finished title to buildMetadata.
        title: `${SITE.name} \u2014 ${SITE.seoTagline}`,
        description: SITE.description,
        applicationName: SITE.name,
        alternates: { canonical: '/' },
        robots: ROBOTS,
        // Search Console ownership proof. Absent env var means no tag is emitted at all, so an
        // unconfigured deployment stays clean rather than publishing an empty content value.
        ...(process.env.GSC_SITE_VERIFICATION
            ? { verification: { google: process.env.GSC_SITE_VERIFICATION } }
            : {}),
        formatDetection: { telephone: false, address: false, email: false },
        openGraph: {
            type: 'website',
            url: SITE.url,
            siteName: SITE.name,
            title: `${SITE.name} \u2014 ${SITE.seoTagline}`,
            description: SITE.description,
            locale: SITE.locale,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${SITE.name} \u2014 ${SITE.seoTagline}`,
            description: SITE.description,
        },
    };
}

/**
 * Build a Next.js Metadata object for a page.
 *
 * `image` is optional on purpose: without it, the file-convention `opengraph-image` for the
 * segment supplies the card, so there is never a reference to an image that does not exist.
 *
 * @param {object} opts
 * @param {string} [opts.title] - Page title including the brand, or `null` for the site default
 * @param {string} [opts.description]
 * @param {string|null} [opts.path] - Canonical path starting with "/"; null omits the canonical
 * @param {'website'|'article'|'video.other'|'profile'} [opts.ogType]
 * @param {{ publishedTime?: string, modifiedTime?: string, authors?: string[], section?: string, tags?: string[] }} [opts.article]
 * @param {string} [opts.image] - Absolute or root-relative image that overrides the segment card
 * @param {boolean} [opts.noIndex]
 * @returns {import('next').Metadata}
 */
export function buildMetadata({
    title,
    description = SITE.description,
    path = '/',
    ogType = 'website',
    article,
    image,
    noIndex = false,
} = {}) {
    const fullTitle = title || `${SITE.name} \u2014 ${SITE.seoTagline}`;
    const url = path ? `${SITE.url}${path}` : undefined;
    const ogImage = image
        ? [{ url: image.startsWith('http') ? image : `${SITE.url}${image}`, width: 1200, height: 630, alt: SITE.name }]
        : undefined;

    const metadata = {
        title: fullTitle,
        description,
        robots: noIndex ? NO_ROBOTS : ROBOTS,
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE.name,
            locale: SITE.locale,
            type: ogType,
            ...(ogImage ? { images: ogImage } : {}),
            ...(ogType === 'article' && article
                ? {
                      publishedTime: article.publishedTime,
                      modifiedTime: article.modifiedTime,
                      authors: article.authors,
                      section: article.section,
                      tags: article.tags,
                  }
                : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            ...(ogImage ? { images: ogImage.map((i) => i.url) } : {}),
        },
    };

    if (path) metadata.alternates = { canonical: path };

    return metadata;
}
