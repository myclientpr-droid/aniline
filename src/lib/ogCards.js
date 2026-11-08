import { buildImageUrl, buildVideoPoster } from '@/lib/cloudinary';
import { renderOgCard } from '@/lib/og';
import { SITE } from '@/lib/site';

/**
 * Per-segment card renderers. Each `opengraph-image.js` is a few lines around one of these, so the
 * layout lives in one place and the route files stay declarative.
 */

/** @param {{ title: string, category?: string, year?: number|string, location?: string, featuredImage?: { publicId?: string }, videoPublicId?: string }} project */
export function projectCard(project) {
    const still = project.videoPublicId
        ? buildVideoPoster(project.videoPublicId, { width: 1200 })
        : project.featuredImage?.publicId
          ? buildImageUrl(project.featuredImage.publicId, { width: 1200, height: 630, crop: 'fill' })
          : undefined;

    return renderOgCard({
        eyebrow: [project.category, project.year].filter(Boolean).join(' \u00b7 ') || 'Selected work',
        title: project.title,
        subtitle: project.location ? `Produced by ${SITE.name} \u00b7 ${project.location}` : `Produced by ${SITE.name}`,
        imageUrl: still,
        footer: 'Portfolio',
    });
}

/** @param {{ title: string, shortDescription?: string, audience?: string[] }} service */
export function serviceCard(service) {
    return renderOgCard({
        eyebrow: 'Service',
        title: service.title,
        subtitle: service.shortDescription || service.audience?.join(' \u00b7 '),
        footer: 'Services',
    });
}

/** @param {{ title: string, excerpt?: string, heroUrl?: string, dateModified?: string }} article */
export function articleCard(article) {
    return renderOgCard({
        eyebrow: 'Journal',
        title: article.title,
        subtitle: article.excerpt,
        imageUrl: article.heroUrl,
        footer: 'AniLine Journal',
    });
}

/** @param {{ h1: string, description: string, eyebrow?: string }} role */
export function roleCard(role) {
    return renderOgCard({
        eyebrow: role.eyebrow || 'Hire AniLine',
        title: role.h1,
        subtitle: role.description,
        footer: 'Roles we fill',
    });
}
