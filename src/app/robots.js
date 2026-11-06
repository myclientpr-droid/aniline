import { SITE } from '@/lib/site';

/**
 * Next.js MetadataRoute.Robots handler.
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/', '/admin'],
            },
        ],
        sitemap: `${SITE.url}/sitemap.xml`,
        host: SITE.url,
    };
}