import { ogAlt, ogContentType, ogSize, renderOgCard } from '@/lib/og';

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOgCard({
        eyebrow: 'Rohingya-led studio',
        title: 'Your Story. Our Community. One Production Partner.',
        subtitle: 'Documentary, campaign, wedding and event films \u2014 filmed, edited and delivered in-house.',
    });
}
