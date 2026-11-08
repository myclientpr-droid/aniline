import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ArticleCard from '@/components/journal/ArticleCard';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import { listArticles } from '@/content/journal';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, itemListJsonLd, webPageJsonLd } from '@/lib/schema';
import { SITE } from '@/lib/site';

const TITLE = 'Journal: Field Notes on Documentary & NGO Production | AniLine';
const DESCRIPTION =
  'Practical writing from AniLine on filming in Cox’s Bazar, commissioning documentaries, and making community-led work with Rohingya stories.';

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/journal',
});

const crumbs = [{ name: 'Home', path: '/' }, { name: 'Journal' }];

export default function JournalPage() {
  const articles = listArticles();

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ path: '/journal', name: TITLE, description: DESCRIPTION }),
          breadcrumbJsonLd(crumbs),
          itemListJsonLd({
            name: 'AniLine Journal',
            items: articles.map((a) => ({
              name: a.title,
              url: `${SITE.url}/journal/${a.slug}`,
            })),
          }),
        ]}
      />

      <PageHero
        eyebrow="Journal"
        title="Field notes."
        subheading="Practical writing for the people who commission, crew and publish documentary work — from the studio that films it."
      />

      <div className="bg-white">
        <Container className="pt-6">
          <Breadcrumb items={crumbs} />
        </Container>
      </div>

      <section className="section-padding bg-white">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <li key={article.slug} className={`rise rise-${(i % 3) + 1}`}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection
        eyebrow="Journal"
        title="Have a question the journal does not answer?"
        description="Write to us — we answer production questions even when the answer is that we are not the right studio for the job."
        secondaryLabel="Read our services"
        secondaryHref="/services"
      />
    </>
  );
}
