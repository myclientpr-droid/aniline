import Hero from '@/components/home/Hero';
import Introduction from '@/components/home/Introduction';
import CommunityPositioning from '@/components/home/CommunityPositioning';
import FeaturedWork from '@/components/home/FeaturedWork';
import ServicesOverview from '@/components/home/ServicesOverview';
import ProductionPartner from '@/components/home/ProductionPartner';
import WhoWeWorkWith from '@/components/home/WhoWeWorkWith';
import WhyAniLine from '@/components/home/WhyAniLine';
import FeaturedClients from '@/components/home/FeaturedClients';
import TeamPreview from '@/components/home/TeamPreview';
import CtaSection from '@/components/ui/CtaSection';
import MotionProvider from '@/components/motion/MotionProvider';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { SERVICE_ID, WEBSITE_ID, webPageJsonLd } from '@/lib/schema';
import { SITE } from '@/lib/site';

export const metadata = buildMetadata({
  title: null,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      {/* The homepage is the site's front door, so its WebPage node says so and links the studio. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          ...webPageJsonLd({
            path: '/',
            name: `${SITE.name} \u2014 ${SITE.seoTagline}`,
            description: SITE.description,
          }),
          '@id': `${SITE.url}/#homepage`,
          isPartOf: { '@id': WEBSITE_ID },
          about: { '@id': SERVICE_ID },
        }}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <MotionProvider>
        <Hero />
        <Introduction />
        <CommunityPositioning />
        <FeaturedWork />
        <ServicesOverview />
        <ProductionPartner />
        <WhoWeWorkWith />
        <WhyAniLine />
        <FeaturedClients />
        <TeamPreview />
        <CtaSection />
      </MotionProvider>
    </>
  );
}
