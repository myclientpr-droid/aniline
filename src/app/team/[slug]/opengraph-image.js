import { getPublishedTeamMemberBySlug } from '@/lib/data/team';
import { ogAlt, ogContentType, ogSize } from '@/lib/og';
import { teamMemberCard } from '@/lib/ogCards';

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }) {
    const { slug } = await Promise.resolve(params);
    const member = await getPublishedTeamMemberBySlug(slug).catch(() => null);
    return teamMemberCard(member || { name: 'AniLine team' });
}
