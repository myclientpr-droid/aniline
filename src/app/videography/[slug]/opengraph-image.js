import { getPublishedVideoBySlug } from '@/lib/data/videos';
import { ogAlt, ogContentType, ogSize } from '@/lib/og';
import { videoCard } from '@/lib/ogCards';

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }) {
    const { slug } = await Promise.resolve(params);
    const film = await getPublishedVideoBySlug(slug).catch(() => null);
    // The guard is the route's job: videoCard() would throw inside satori on a null film.
    return videoCard(film || { title: 'AniLine films' });
}
