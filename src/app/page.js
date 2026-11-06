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
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: null,
  path: '/',
});

export default function HomePage() {
  return (
    <>
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
