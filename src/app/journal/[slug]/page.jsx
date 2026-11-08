import { notFound } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ArticleBody from '@/components/journal/ArticleBody';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import {
  ARTICLES,
  articleAuthor,
  buildArticleMetadata,
  getArticle,
  listArticles,
} from '@/content/journal';
import { SERVICES_PAGE, SITE } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from '@/lib/schema';

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await Promise.resolve(params);
  const article = getArticle(slug);
  if (!article) return buildMetadata({ title: 'Article not found', path: null, noIndex: true });
  return buildMetadata(buildArticleMetadata(article));
}

function formatDate(value) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await Promise.resolve(params);
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/journal/${article.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Journal', path: '/journal' },
    { name: article.title },
  ];
  const linkedServices = (article.relatedServices || [])
    .map((s) => SERVICES_PAGE.fallbackServices.find((service) => service.slug === s))
    .filter(Boolean);
  const related = (article.related || []).map(getArticle).filter(Boolean);
  const heroUrl = article.hero?.src ? `${SITE.url}${article.hero.src}` : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ path, name: article.title, description: article.description }),
          breadcrumbJsonLd(crumbs),
          {
            ...articleJsonLd({
              title: article.title,
              description: article.description,
              slug: article.slug,
              heroUrl,
              datePublished: article.datePublished,
              dateModified: article.dateModified,
              authorName: articleAuthor().name,
              section: article.section,
              tags: article.tags,
            }),
            '@context': 'https://schema.org',
          },
          { ...faqJsonLd(article.faqs), '@context': 'https://schema.org' },
        ]}
      />

      <PageHero eyebrow={article.section} title={article.title} subheading={article.excerpt} />

      <div className="bg-white">
        <Container className="pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb items={crumbs} />
          <p className="text-slate text-xs uppercase tracking-wider">
            <time dateTime={article.datePublished}>{formatDate(article.datePublished)}</time>
            {' \u00b7 '}
            {articleAuthor().name}
          </p>
        </Container>
      </div>

      <section className="section-padding bg-white">
        <Container>
          <ArticleBody article={article} linkedServices={linkedServices} related={related} />
          <div className="max-w-3xl mt-12">
            <Link
              href="/journal"
              className="text-sm font-semibold text-navy hover:text-orange transition-colors"
            >
              &larr; All journal articles
            </Link>
          </div>
        </Container>
      </section>

      <CtaSection
        eyebrow="AniLine"
        title="Planning a production like this?"
        description="Tell us the story, the audience and the dates — we will come back with scope and a realistic schedule."
      />
    </>
  );
}
