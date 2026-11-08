import { getPublishedServiceBySlug } from '@/lib/data/services';
import { ogAlt, ogContentType, ogSize } from '@/lib/og';
import { serviceCard } from '@/lib/ogCards';
import { SERVICES_PAGE } from '@/lib/site';

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }) {
    const { slug } = await Promise.resolve(params);
    const service =
        (await getPublishedServiceBySlug(slug).catch(() => null)) ||
        SERVICES_PAGE.fallbackServices.find((s) => s.slug === slug);
    return serviceCard(service || { title: 'AniLine services' });
}
