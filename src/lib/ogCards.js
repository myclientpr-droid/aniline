import { buildImageUrl, buildVideoPoster } from '@/lib/cloudinary';
import { VIDEO_KINDS, buildEmbedThumbUrl, resolveVideoSource } from '@/lib/videoSources';
import { formatDuration, resolveFilmSource } from '@/lib/videography';
import { renderOgCard } from '@/lib/og';
import { SITE } from '@/lib/site';

/**
 * Per-segment card renderers. Each `opengraph-image.js` is a few lines around one of these, so the
 * layout lives in one place and the route files stay declarative.
 */

/** @param {{ title: string, category?: string, year?: number|string, location?: string, featuredImage?: { publicId?: string }, videoUrl?: string, videoPublicId?: string }} project */
export function projectCard(project) {
    const video = resolveVideoSource(project);
    // Certainty first: satori has no onError, so a 404 here can fail the whole route.
    const still =
        project.featuredImage?.publicId
            ? buildImageUrl(project.featuredImage.publicId, { width: 1200, height: 630, crop: 'fill' })
            : video.kind === VIDEO_KINDS.YOUTUBE
              ? buildEmbedThumbUrl(video.embed, 'mqdefault')
              : video.kind === VIDEO_KINDS.CLOUDINARY
                ? buildVideoPoster(video.publicId, { width: 1200, height: 630 })
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

/** @param {{ name: string, role?: string, expertise?: string[], photo?: { publicId?: string } }} member */
export function teamMemberCard(member) {
    return renderOgCard({
        eyebrow: 'Team',
        title: member.name,
        subtitle: [member.role, ...(member.expertise || []).slice(0, 3)]
            .filter(Boolean)
            .join(' \u00b7 '),
        // Certainty first: satori has no onError, so a photo that fails to fetch would break the route.
        imageUrl: member.photo?.publicId
            ? buildImageUrl(member.photo.publicId, {
                  width: 1200,
                  height: 630,
                  crop: 'fill',
                  gravity: 'face',
              })
            : undefined,
        footer: 'Our team',
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

/**
 * A film card. Deliberately not `filmPoster`: that builder matches the player's ratio, and a 9:16
 * crop inside `og.js`'s fixed 640x630 panel would be a 354px slice of a phone reel. Social cards are
 * landscape, so the still is requested at the card's own shape instead.
 * @param {{ title: string, category?: string, year?: number|string, location?: string, durationSeconds?: number|null, videoUrl?: string, poster?: { publicId?: string } | null }} film
 */
export function videoCard(film) {
    const video = resolveFilmSource(film);
    // Certainty first: satori has no onError, and maxresdefault 404s often enough to fail the route.
    const still = film.poster?.publicId
        ? buildImageUrl(film.poster.publicId, { width: 1200, height: 630, crop: 'fill' })
        : video.kind === VIDEO_KINDS.YOUTUBE
          ? buildEmbedThumbUrl(video.embed, 'mqdefault')
          : undefined;
    const runtime = formatDuration(film.durationSeconds);

    return renderOgCard({
        eyebrow: [film.category, film.year].filter(Boolean).join(' \u00b7 ') || 'Film',
        title: film.title,
        subtitle: [
            film.location ? `Filmed by ${SITE.name} \u00b7 ${film.location}` : `Filmed by ${SITE.name}`,
            runtime,
        ]
            .filter(Boolean)
            .join(' \u00b7 '),
        imageUrl: still,
        footer: 'Videography',
    });
}
