import { getPublishedProjectBySlug } from '@/lib/data/projects';
import { ogAlt, ogContentType, ogSize } from '@/lib/og';
import { projectCard } from '@/lib/ogCards';

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }) {
    const { slug } = await Promise.resolve(params);
    const project = await getPublishedProjectBySlug(slug).catch(() => null);
    return projectCard(project || { title: 'AniLine portfolio' });
}
