import { listPublishedProjectSlugs } from '@/lib/data/projects';
import { listPublishedServices } from '@/lib/data/services';
import { SITE } from '@/lib/site';

/**
 * Next.js MetadataRoute.Sitemap handler.
 * @returns {Promise<import('next').MetadataRoute.Sitemap>}
 */
export default async function sitemap() {
    const now = new Date();

    const staticRoutes = [
        { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE.url}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE.url}/photography`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE.url}/team`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
        { url: `${SITE.url}/start-a-project`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
        { url: `${SITE.url}/clients`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ];

    let projectRoutes = [];
    let serviceRoutes = [];

    try {
        const slugs = await listPublishedProjectSlugs();
        projectRoutes = slugs.map((p) => ({
            url: `${SITE.url}/work/${p.slug}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
            changeFrequency: 'monthly',
            priority: 0.7,
        }));
    } catch {
        // DB unreachable — skip dynamic routes rather than crash the sitemap.
    }

    try {
        const services = await listPublishedServices();
        serviceRoutes = services
            .filter((s) => s.slug)
            .map((s) => ({
                url: `${SITE.url}/services/${s.slug}`,
                lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
                changeFrequency: 'monthly',
                priority: 0.7,
            }));
    } catch {
        // Same fallback.
    }

    return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}