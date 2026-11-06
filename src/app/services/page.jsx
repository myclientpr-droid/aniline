import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import ServiceCard from '@/components/ui/ServiceCard';
import CtaSection from '@/components/ui/CtaSection';
import Button from '@/components/ui/Button';
import { listPublishedServices } from '@/lib/data/services';
import { buildMetadata } from '@/lib/seo';
import { SERVICES_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Services',
    description:
        'Documentary, promotional, commercial, wedding, music video, NGO, photography, editing, post-production, website, and software services by AniLine.',
    path: '/services',
});

async function getServices() {
    try {
        const items = await listPublishedServices();
        return items.length > 0 ? items : SERVICES_PAGE.fallbackServices;
    } catch {
        return SERVICES_PAGE.fallbackServices;
    }
}

export default async function ServicesPage() {
    const { hero, process } = SERVICES_PAGE;
    const services = await getServices();

    return (
        <>
            {/* Hero */}
            <PageHero
                eyebrow={hero.eyebrow}
                title={hero.title}
                subheading={hero.subheading}
                actions={
                    <Button href="/start-a-project" variant="primary" size="lg">
                        Start a Project
                    </Button>
                }
            />

            {/* Services grid */}
            <section className="section-padding bg-white">
                <Container>
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, i) => (
                            <li key={String(service._id)} className={`rise rise-${(i % 3) + 1}`}>
                                <ServiceCard service={service} index={i} />
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* Process */}
            <section className="section-padding bg-light">
                <Container>
                    <SectionHeading
                        className="rise"
                        eyebrow={process.eyebrow}
                        title={process.title}
                        align="center"
                    />
                    <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        {process.steps.map((step, i) => (
                            <li
                                key={step.title}
                                className={`rise rise-${(i % 5) + 1} elevate-1 bg-white rounded-lg p-6`}
                            >
                                <span className="text-xs font-semibold text-orange tracking-widest">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="text-navy text-base font-semibold mt-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate text-sm mt-2">{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            <CtaSection />
        </>
    );
}