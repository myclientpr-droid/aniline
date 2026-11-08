import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import { getPublishedServiceBySlug, listPublishedServices } from '@/lib/data/services';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, serviceJsonLd, webPageJsonLd } from '@/lib/schema';
import { SERVICES_PAGE, SITE } from '@/lib/site';

export async function generateStaticParams() {
    try {
        const services = await listPublishedServices();
        return services.filter((s) => s.slug).map((s) => ({ slug: s.slug }));
    } catch {
        return [];
    }
}

// The services list falls back to static copy when the database is empty, so those slugs must still
// resolve on demand rather than 404.
export const dynamicParams = true;

async function getService(slug) {
    try {
        const service = await getPublishedServiceBySlug(slug);
        if (service) return service;
    } catch {
        // Database unreachable — fall through to the static list.
    }
    return SERVICES_PAGE.fallbackServices.find((s) => s.slug === slug) || null;
}

export async function generateMetadata({ params }) {
    const { slug } = await Promise.resolve(params);
    const service = await getService(slug);
    if (!service) {
        return buildMetadata({
            title: 'Service not found',
            path: `/services/${slug}`,
            noIndex: true,
        });
    }
    return buildMetadata({
        title: `${service.seoTitle || service.title} | ${SITE.name}`,
        description: service.seoDescription || service.shortDescription || undefined,
        path: `/services/${service.slug}`,
    });
}

export default async function ServiceDetailPage({ params }) {
    const { slug } = await Promise.resolve(params);
    const service = await getService(slug);
    if (!service) notFound();

    const path = `/services/${service.slug}`;
    const node = serviceJsonLd({
        title: service.title,
        slug: service.slug,
        shortDescription: service.shortDescription,
        description: service.description,
        audience: service.audience,
        deliverables: service.deliverables,
    });

    return (
        <>
            <JsonLd
                data={[
                    webPageJsonLd({
                        path,
                        name: service.title,
                        description: service.shortDescription || undefined,
                        about: { '@id': node['@id'] },
                    }),
                    breadcrumbJsonLd([
                        { name: 'Home', path: '/' },
                        { name: 'Services', path: '/services' },
                        { name: service.title, path },
                    ]),
                    { ...node, '@context': 'https://schema.org' },
                ]}
            />

            <PageHero
                eyebrow="Service"
                title={service.title}
                subheading={service.shortDescription || undefined}
                actions={
                    <Button href="/start-a-project" variant="primary" size="lg">
                        Start a Project
                    </Button>
                }
            />

            <div className="bg-white">
                <Container className="pt-6">
                    <Breadcrumb
                        items={[
                            { name: 'Home', path: '/' },
                            { name: 'Services', path: '/services' },
                            { name: service.title },
                        ]}
                    />
                </Container>
            </div>

            {service.description && (
                <section className="section-padding bg-white">
                    <Container>
                        <div className="rise max-w-3xl whitespace-pre-line text-slate text-base md:text-lg leading-relaxed">
                            {service.description}
                        </div>
                    </Container>
                </section>
            )}

            {Array.isArray(service.deliverables) && service.deliverables.length > 0 && (
                <section className="section-padding bg-light">
                    <Container>
                        <span aria-hidden="true" className="depth-rule mb-4 block" />
                        <h2 className="text-navy mb-6">What you receive</h2>
                        <ul className="rise grid gap-3 sm:grid-cols-2 max-w-3xl">
                            {service.deliverables.map((d) => (
                                <li key={d} className="flex items-start gap-3 text-slate">
                                    <span
                                        aria-hidden="true"
                                        className="mt-2 h-1.5 w-1.5 rounded-full bg-orange flex-none"
                                    />
                                    <span>{d}</span>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            <CtaSection />
        </>
    );
}
