import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import Button from '@/components/ui/Button';
import CtaSection from '@/components/ui/CtaSection';
import { getPublishedServiceBySlug } from '@/lib/data/services';
import {
    buildMetadata,
    breadcrumbJsonLd,
    serviceJsonLd,
    stringifyJsonLd,
} from '@/lib/seo';

export async function generateMetadata({ params }) {
    const { slug } = await Promise.resolve(params);
    const service = await getPublishedServiceBySlug(slug).catch(() => null);
    if (!service) {
        return buildMetadata({
            title: 'Service not found',
            path: `/services/${slug}`,
            noIndex: true,
        });
    }
    return buildMetadata({
        title: service.seoTitle || service.title,
        description: service.seoDescription || service.shortDescription || undefined,
        path: `/services/${service.slug}`,
    });
}

export default async function ServiceDetailPage({ params }) {
    const { slug } = await Promise.resolve(params);
    const service = await getPublishedServiceBySlug(slug).catch(() => null);
    if (!service) notFound();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: stringifyJsonLd(
                        breadcrumbJsonLd([
                            { name: 'Home', path: '/' },
                            { name: 'Services', path: '/services' },
                            { name: service.title, path: `/services/${service.slug}` },
                        ])
                    ),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: stringifyJsonLd(
                        serviceJsonLd({
                            title: service.title,
                            slug: service.slug,
                            shortDescription: service.shortDescription,
                            description: service.description,
                        })
                    ),
                }}
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