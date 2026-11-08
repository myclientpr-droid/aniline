import { listArticles } from '@/content/journal';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

const TITLE = 'AniLine Journal';
const DESCRIPTION =
  'Field notes on documentary, NGO and community-led production from AniLine, a Rohingya-led studio in Cox’s Bazar, Bangladesh.';

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const articles = listArticles();
  const latest = articles[0]?.dateModified || articles[0]?.datePublished;
  const items = articles
    .map((article) => {
      const url = `${SITE.url}/journal/${article.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(article.excerpt)}</description>`,
        `      <category>${escapeXml(article.section)}</category>`,
        `      <pubDate>${new Date(`${article.datePublished}T00:00:00Z`).toUTCString()}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${SITE.url}/journal</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE.url}/journal/rss.xml" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${new Date(`${latest}T00:00:00Z`).toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
