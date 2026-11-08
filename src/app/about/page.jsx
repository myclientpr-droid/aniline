import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import PageHero from '@/components/layout/PageHero';
import CtaSection from '@/components/ui/CtaSection';
import PageSchema from '@/components/seo/PageSchema';
import { buildMetadata } from '@/lib/seo';
import { ABOUT } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'About AniLine | Rohingya-Led Video & Photo Studio',
    description:
        'AniLine is a Rohingya-led video production, photography, and post-production studio established in 2020. Meet the studio and how we work.',
    path: '/about',
});

export default function AboutPage() {
    const { hero, story, approach, values, capabilities } = ABOUT;

    return (
        <>
            <PageSchema
                path="/about"
                title="About AniLine | Rohingya-Led Video & Photo Studio"
                description={metadata.description}
                type="AboutPage"
            />
            {/* Hero */}
            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            {/* Story */}
            <section className="section-padding bg-white">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="rise md:col-span-5">
                            <SectionHeading eyebrow={story.eyebrow} title={story.title} />
                        </div>
                        <div className="rise rise-2 md:col-span-7 space-y-5">
                            {story.body.map((p, i) => (
                                <p key={i} className="text-slate text-base md:text-lg leading-relaxed">
                                    {p}
                                </p>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Approach */}
            <section className="section-padding bg-light">
                <Container>
                    <SectionHeading
                        eyebrow={approach.eyebrow}
                        title={approach.title}
                        align="center"
                    />
                    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {approach.items.map((item, i) => (
                            <li key={item.title} className={`rise rise-${(i % 4) + 1}`}>
                                <div className="tilt-card specular-warm elevate-2 h-full rounded-lg bg-white p-6">
                                    <h3 className="tilt-lift-1 text-navy text-lg">{item.title}</h3>
                                    <p className="tilt-lift-1 text-slate text-sm mt-3">
                                        {item.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* Values */}
            <section className="section-padding bg-white">
                <Container>
                    <SectionHeading
                        eyebrow={values.eyebrow}
                        title={values.title}
                        align="center"
                    />
                    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.items.map((item, i) => (
                            <li key={item.title} className={`rise rise-${(i % 4) + 1}`}>
                                <div className="tilt-card specular-warm elevate-1 h-full rounded-lg border border-navy/10 bg-white p-6">
                                    <h3 className="tilt-lift-1 text-navy text-lg">{item.title}</h3>
                                    <p className="tilt-lift-1 text-slate text-sm mt-3">
                                        {item.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* Capabilities */}
            <section className="section-padding bg-light">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="rise md:col-span-5">
                            <SectionHeading
                                eyebrow={capabilities.eyebrow}
                                title={capabilities.title}
                            />
                        </div>
                        <div className="rise rise-2 md:col-span-7">
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {capabilities.items.map((cap) => (
                                    <li
                                        key={cap}
                                        className="flex items-start gap-3 text-slate"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-2 h-1.5 w-1.5 rounded-full bg-orange flex-none"
                                        />
                                        <span>{cap}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Container>
            </section>

            <CtaSection />
        </>
    );
}