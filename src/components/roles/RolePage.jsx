import Link from 'next/link';
import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/ui/ProjectCard';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import { listPublishedProjects } from '@/lib/data/projects';
import { breadcrumbJsonLd, faqJsonLd, roleServiceJsonLd, webPageJsonLd } from '@/lib/schema';
import { SERVICES_PAGE, SITE } from '@/lib/site';

async function relatedWork(role) {
  const categories = role.workCategories?.slice(0, 2) || [];
  if (categories.length === 0) return [];
  const found = [];
  for (const category of categories) {
    if (found.length >= 3) break;
    try {
      const result = await listPublishedProjects({ page: 1, pageSize: 3, category });
      found.push(...result.items);
    } catch {
      // DB unreachable — a role page is still useful without the portfolio strip.
    }
  }
  return found.slice(0, 3);
}

function relatedServiceLinks(role) {
  const all = SERVICES_PAGE.fallbackServices;
  return (role.relatedServices || [])
    .map((slug) => all.find((s) => s.slug === slug))
    .filter(Boolean);
}

/**
 * The one template behind every role page. Server component: the schema, breadcrumb and FAQ all
 * describe the same content the reader sees.
 * @param {{ role: object }} props
 */
export default async function RolePage({ role }) {
  const path = `/${role.slug}`;
  const service = roleServiceJsonLd(role);
  const services = relatedServiceLinks(role);
  const projects = await relatedWork(role);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Hire us', path: '/services' },
    { name: role.eyebrow },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path,
            name: role.seoTitle,
            description: role.description,
            about: { '@id': service['@id'] },
          }),
          breadcrumbJsonLd(crumbs),
          { ...service, '@context': 'https://schema.org' },
          { ...faqJsonLd(role.faqs), '@context': 'https://schema.org' },
        ]}
      />

      <PageHero
        eyebrow={role.eyebrow}
        title={role.h1}
        subheading={role.description}
        actions={
          <Button href="/start-a-project" variant="primary" size="lg">
            Start a Project
          </Button>
        }
      />

      <div className="bg-white">
        <Container className="pt-6">
          <Breadcrumb items={crumbs} />
        </Container>
      </div>

      <section className="section-padding bg-white">
        <Container>
          <div className="rise max-w-3xl">
            <span aria-hidden="true" className="depth-rule mb-4 block" />
            {role.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-slate text-base md:text-lg leading-relaxed mt-4 first:mt-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding bg-light">
        <Container>
          <SectionHeading
            className="rise"
            eyebrow="Who it's for"
            title={`When to hire an ${role.eyebrow.toLowerCase()}`}
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {role.forWhom.map((item, i) => (
              <li
                key={item.title}
                className={`rise rise-${i + 1} elevate-1 bg-white rounded-lg p-6`}
              >
                <h3 className="text-navy text-lg">{item.title}</h3>
                <p className="text-slate text-sm mt-3">{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-padding bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading className="rise" eyebrow="Deliverables" title="What you receive" />
            </div>
            <ul className="lg:col-span-7 rise grid gap-3 sm:grid-cols-2">
              {role.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 rounded-full bg-orange flex-none"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-light">
        <Container>
          <SectionHeading className="rise" eyebrow="Our approach" title="How the work runs" />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {role.approach.map((step, i) => (
              <li key={step.title} className={`rise rise-${(i % 4) + 1} bg-white rounded-lg p-6`}>
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

      {services.length > 0 && (
        <section className="section-padding bg-white">
          <Container>
            <SectionHeading className="rise" eyebrow="Services" title={role.relatedServicesLabel} />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((linked) => (
                <li key={linked.slug} className="rise">
                  <Link
                    href={`/services/${linked.slug}`}
                    className="group block h-full rounded-lg border border-navy/10 p-6 transition-colors hover:border-navy/30"
                  >
                    <h3 className="text-navy text-lg group-hover:text-navy-dark">{linked.title}</h3>
                    <p className="text-slate text-sm mt-2">{linked.shortDescription}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section-padding bg-light">
          <Container>
            <SectionHeading className="rise" eyebrow="Related work" title="Productions like this" />
            <ul className="mt-10 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={String(project._id)} className="rise">
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="/work" variant="secondary">
                View all work
              </Button>
            </div>
          </Container>
        </section>
      )}

      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading className="rise" eyebrow="Questions" title="Common questions" />
            <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
              {role.faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-navy font-semibold [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="text-orange text-xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-slate text-sm mt-3 max-w-2xl">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16 bg-white">
        <Container>
          <p className="text-slate text-sm">
            Hire AniLine as your {role.eyebrow.toLowerCase()}. Studio based in{' '}
            {SITE.location.region}, {SITE.location.country}; available internationally.{' '}
            <Link
              href="/start-a-project"
              className="text-navy underline underline-offset-4 hover:text-orange"
            >
              Tell us about the production
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaSection
        eyebrow={role.eyebrow}
        title="Ready to brief us?"
        description="Send the dates, locations and what the work needs to do — we will come back with scope, schedule and cost."
      />
    </>
  );
}
