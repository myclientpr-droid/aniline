import { listPublishedProjectSlugs } from '@/lib/data/projects';
import { listPublishedVideoSlugs } from '@/lib/data/videos';
import { listPublishedServices } from '@/lib/data/services';
import { listPublishedTeamMemberSlugs } from '@/lib/data/team';
import { listRoles } from '@/content/roles';
import { listArticles } from '@/content/journal';
import { slugify } from '@/lib/slug';
import { CONTENT_UPDATED, LEGAL, SITE } from '@/lib/site';

/**
 * Next.js MetadataRoute.Sitemap handler.
 *
 * `lastModified` comes from content, never from the clock: a sitemap that says "now" on every
 * request tells Google every URL changed every time it asks, and teaches it to trust none of it.
 * @returns {Promise<import('next').MetadataRoute.Sitemap>}
 */
export default async function sitemap() {
  const contentUpdated = new Date(`${CONTENT_UPDATED}T00:00:00Z`);
  const legalUpdated = new Date(`${LEGAL.effectiveDate}T00:00:00Z`);
  const fallbackModified = contentUpdated;

  const staticRoutes = [
    { path: '/', lastModified: contentUpdated, changeFrequency: 'weekly', priority: 1.0 },
    { path: '/about', lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.8 },
    { path: '/services', lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.9 },
    { path: '/work', lastModified: contentUpdated, changeFrequency: 'weekly', priority: 0.9 },
    {
      path: '/videography',
      lastModified: contentUpdated,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      path: '/photography',
      lastModified: contentUpdated,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    { path: '/journal', lastModified: contentUpdated, changeFrequency: 'weekly', priority: 0.8 },
    { path: '/team', lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', lastModified: contentUpdated, changeFrequency: 'yearly', priority: 0.6 },
    {
      path: '/start-a-project',
      lastModified: contentUpdated,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    { path: '/clients', lastModified: contentUpdated, changeFrequency: 'monthly', priority: 0.7 },
    {
      path: LEGAL.privacyHref,
      lastModified: legalUpdated,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    { path: LEGAL.termsHref, lastModified: legalUpdated, changeFrequency: 'yearly', priority: 0.3 },
  ].map(({ path, ...entry }) => ({ url: `${SITE.url}${path}`, ...entry }));

  const roleRoutes = listRoles().map((role) => ({
    url: `${SITE.url}/${role.slug}`,
    lastModified: new Date(`${role.updated}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const articleRoutes = listArticles().map((article) => ({
    url: `${SITE.url}/journal/${article.slug}`,
    lastModified: new Date(`${article.dateModified}T00:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  let projectRoutes = [];
  let videoRoutes = [];
  let serviceRoutes = [];
  let teamRoutes = [];

  try {
    const slugs = await listPublishedProjectSlugs();
    projectRoutes = slugs.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : fallbackModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // DB unreachable — skip dynamic routes rather than crash the sitemap.
  }

  try {
    const films = await listPublishedVideoSlugs();
    videoRoutes = films.map((f) => ({
      url: `${SITE.url}/videography/${f.slug}`,
      lastModified: f.updatedAt ? new Date(f.updatedAt) : fallbackModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // Same fallback.
  }

  try {
    const services = await listPublishedServices();
    serviceRoutes = services
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${SITE.url}/services/${s.slug}`,
        lastModified: s.updatedAt ? new Date(s.updatedAt) : fallbackModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
  } catch {
    // Same fallback.
  }

  try {
    const members = await listPublishedTeamMemberSlugs();
    teamRoutes = members
      .map((m) => ({ slug: m.slug || slugify(m.name), updatedAt: m.updatedAt }))
      .filter((m) => m.slug)
      .map((m) => ({
        url: `${SITE.url}/team/${m.slug}`,
        lastModified: m.updatedAt ? new Date(m.updatedAt) : fallbackModified,
        changeFrequency: 'monthly',
        priority: 0.5,
      }));
  } catch {
    // Same fallback.
  }

  return [
    ...staticRoutes,
    ...roleRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...videoRoutes,
    ...articleRoutes,
    ...teamRoutes,
  ];
}
