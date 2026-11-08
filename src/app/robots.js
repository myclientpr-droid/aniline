import { SITE } from '@/lib/site';

const DISALLOW = ['/api/', '/admin/', '/admin'];

/**
 * Next.js MetadataRoute.Robots handler.
 *
 * Answer engines are allowed in deliberately: this portfolio's job is to be found and quoted by
 * people planning international productions. Only the admin and API are closed.
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // Crawlers that need to be named because they carry their own default rules.
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-SearchBot',
          'Google-Extended',
          'CCBot',
        ],
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
