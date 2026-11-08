import { getArticle } from '@/content/journal';
import { ogAlt, ogContentType, ogSize } from '@/lib/og';
import { articleCard } from '@/lib/ogCards';
import { SITE } from '@/lib/site';

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }) {
  const { slug } = await Promise.resolve(params);
  const article = getArticle(slug);
  return articleCard({
    title: article?.title || 'AniLine Journal',
    excerpt: article?.excerpt,
    heroUrl: article?.hero?.src ? `${SITE.url}${article.hero.src}` : undefined,
  });
}
