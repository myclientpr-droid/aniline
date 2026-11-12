import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import PageHero from '@/components/layout/PageHero';
import CtaSection from '@/components/ui/CtaSection';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import SocialIcon from '@/components/ui/SocialIcon';
import ServiceCard from '@/components/ui/ServiceCard';
import TeamPortrait from '@/components/team/TeamPortrait';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, personJsonLd, webPageJsonLd } from '@/lib/schema';
import { DEVELOPER_PAGE } from '@/lib/site';

const PATH = '/developer';
// The footer anchor, the URL and this crumb all read "About Developer"; the h1 reads who he is.
const CRUMB = 'Developer';

export const metadata = buildMetadata({
    title: 'Mohammed Ismail | Web & Android Developer | AniLine',
    description:
        'Mohammed Ismail is an independent full-stack web and Android developer in Bangladesh, and the developer behind this site.',
    path: PATH,
    ogType: 'profile',
});

export default function AboutDeveloperPage() {
    const { hero, person, intro, focus, projects, principles, studio, links } = DEVELOPER_PAGE;
    const whatsappDigits = person.whatsapp ? person.whatsapp.replace(/[^\d]/g, '') : '';

    const personNode = personJsonLd({
        name: person.name,
        jobTitle: person.jobTitle,
        // His own opening sentence, so the node restates approved copy instead of new claims.
        description: intro.body[0],
        path: PATH,
        knowsAbout: person.knowsAbout,
        sameAs: [person.portfolio, person.facebook],
        telephone: person.whatsapp,
        country: person.country,
        creations: projects.items,
    });

    return (
        <>
            <JsonLd
                data={[
                    webPageJsonLd({
                        path: PATH,
                        name: CRUMB,
                        description: metadata.description,
                        type: 'ProfilePage',
                        mainEntity: { '@id': personNode['@id'] },
                    }),
                    breadcrumbJsonLd([
                        { name: 'Home', path: '/' },
                        { name: CRUMB, path: PATH },
                    ]),
                    { '@context': 'https://schema.org', ...personNode },
                ]}
            />

            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            <div className="bg-white">
                <Container className="pt-6">
                    <Breadcrumb
                        items={[{ name: 'Home', path: '/' }, { name: CRUMB }]}
                    />
                </Container>
            </div>

            {/* Identity */}
            <section className="section-padding bg-white">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="rise md:col-span-4">
                            <TeamPortrait
                                member={person}
                                ratio="profile"
                                showRoleChip={false}
                                priority
                            />
                        </div>
                        <div className="rise rise-2 md:col-span-7 md:col-start-6">
                            <SectionHeading eyebrow={intro.eyebrow} title={intro.title} />
                            <div className="mt-6 space-y-5">
                                {intro.body.map((paragraph, i) => (
                                    <p
                                        key={i}
                                        className="text-slate text-base md:text-lg leading-relaxed"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-8">
                                <span aria-hidden="true" className="depth-rule mb-4 block" />
                                <h2 className="text-navy mb-4">What I build</h2>
                                <ul className="flex flex-wrap gap-2">
                                    {person.knowsAbout.map((topic) => (
                                        <li
                                            key={topic}
                                            className="rounded-full bg-orange/10 px-3 py-1.5 text-[12.5px] font-semibold text-[#9a6400] ring-1 ring-inset ring-orange/20"
                                        >
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Currently focused on */}
            <section className="section-padding bg-light">
                <Container>
                    <div className="rise">
                        <div className="tilt-card specular-warm elevate-2 rounded-lg bg-white p-8 md:p-12">
                            <p className="tilt-lift-1 text-orange text-xs font-semibold uppercase tracking-[0.18em]">
                                {focus.eyebrow}
                            </p>
                            <h2 className="tilt-lift-1 text-navy mt-4 text-balance">
                                {focus.statement}
                            </h2>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Projects */}
            <section className="section-padding bg-white">
                <Container>
                    <SectionHeading
                        eyebrow={projects.eyebrow}
                        title={projects.title}
                        description={projects.description}
                    />
                    <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.items.map((name) => (
                            <li key={name} className="flex items-start gap-3">
                                <span
                                    aria-hidden="true"
                                    className="mt-2 h-1.5 w-1.5 rounded-full bg-orange flex-none"
                                />
                                <span className="text-navy font-semibold">{name}</span>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* Principles */}
            <section className="section-padding bg-light">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="rise md:col-span-5">
                            <SectionHeading eyebrow={principles.eyebrow} title={principles.title} />
                        </div>
                        <div className="rise rise-2 md:col-span-7 space-y-5">
                            {principles.body.map((paragraph, i) => (
                                <p
                                    key={i}
                                    className="text-slate text-base md:text-lg leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* The studio's digital services */}
            <section className="section-padding bg-white">
                <Container>
                    <SectionHeading
                        eyebrow={studio.eyebrow}
                        title={studio.title}
                        description={studio.description}
                    />
                    <ul className="mt-12 grid gap-6 sm:grid-cols-2">
                        {studio.items.map((service, i) => (
                            <li key={service.slug} className={`rise rise-${(i % 3) + 1}`}>
                                <ServiceCard service={service} index={i} />
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* Connect — dark so the social tiles read; they are built for a dark surface */}
            <section className="section-padding bg-navy-dark text-white">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="rise md:col-span-6">
                            <SectionHeading
                                eyebrow={links.eyebrow}
                                title={links.title}
                                description={links.description}
                                tone="light"
                            />
                        </div>
                        <div className="rise rise-2 md:col-span-5 md:col-start-8">
                            <Button
                                href={person.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="primary"
                                size="lg"
                            >
                                View my portfolio
                            </Button>

                            <ul className="mt-6 flex flex-wrap gap-2">
                                {person.facebook && (
                                    <li>
                                        <SocialIcon
                                            network="facebook"
                                            href={person.facebook}
                                            label={`${person.name} on Facebook (opens in new tab)`}
                                        />
                                    </li>
                                )}
                                {whatsappDigits && (
                                    <li>
                                        <SocialIcon
                                            network="whatsapp"
                                            href={`https://wa.me/${whatsappDigits}`}
                                            label={`Chat with ${person.name} on WhatsApp (opens in new tab)`}
                                        />
                                    </li>
                                )}
                            </ul>

                            {whatsappDigits && (
                                <p className="text-white/60 text-sm mt-5">
                                    WhatsApp{' '}
                                    <a
                                        href={`https://wa.me/${whatsappDigits}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-orange transition-colors"
                                    >
                                        {person.whatsapp}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            <CtaSection
                eyebrow="AniLine"
                title="Websites and software, made with the same care as our films."
                description="See what the studio offers, or write to us about a production."
                primaryLabel="Explore our services"
                primaryHref="/services"
                secondaryLabel="Contact AniLine"
                secondaryHref="/contact"
            />
        </>
    );
}
