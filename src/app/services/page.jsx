import Link from 'next/link';
import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import ServiceCard from '@/components/ui/ServiceCard';
import CtaSection from '@/components/ui/CtaSection';
import Button from '@/components/ui/Button';
import PageSchema from '@/components/seo/PageSchema';
import { listPublishedServices } from '@/lib/data/services';
import { ROLE_LINKS } from '@/content/roles';
import { buildMetadata } from '@/lib/seo';
import { itemListJsonLd } from '@/lib/schema';
import { SERVICES_PAGE, SITE } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Video, Photo & Digital Services | AniLine',
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
      <PageSchema
        path="/services"
        title="Video, Photo & Digital Services | AniLine"
        description={metadata.description}
        type="CollectionPage"
        nodes={[
          itemListJsonLd({
            name: 'AniLine services',
            items: services
              .filter((s) => s.slug)
              .map((s) => ({ name: s.title, url: `${SITE.url}/services/${s.slug}` })),
          }),
        ]}
      />
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

      {/* Roles: the queries buyers type when they need a person, not a package */}
      <section className="section-padding bg-white border-b border-navy/10">
        <Container>
          <SectionHeading
            className="rise"
            eyebrow="Hire us as"
            title="Or book the role you need."
            description="Videographer, camera operator, editor, photographer or a whole field media team \u2014 each has its own page."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ROLE_LINKS.map((role, i) => (
              <li key={role.slug} className={`rise rise-${(i % 5) + 1}`}>
                <Link
                  href={`/${role.slug}`}
                  className="group flex h-full items-center justify-between rounded-lg border border-navy/10 px-5 py-4 text-navy font-semibold transition-colors hover:border-navy/30 hover:text-orange"
                >
                  {role.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
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
                <h3 className="text-navy text-base font-semibold mt-3">{step.title}</h3>
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
