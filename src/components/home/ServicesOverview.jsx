import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import ServiceCard from '@/components/ui/ServiceCard';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import { listPublishedServices } from '@/lib/data/services';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

// Fallback so the homepage communicates services before DB is seeded.
// These are descriptions, not claims about the business beyond what the brief confirms.
const FALLBACK_SERVICES = [
    {
        _id: 'f1',
        title: 'Documentary Video Production',
        slug: '',
        shortDescription:
            'Long-form and short documentary work, filmed and edited end-to-end.',
    },
    {
        _id: 'f2',
        title: 'Promotional & Commercial Video',
        slug: '',
        shortDescription:
            'Brand, product, and campaign films for businesses and organizations.',
    },
    {
        _id: 'f3',
        title: 'Wedding Films',
        slug: '',
        shortDescription:
            'Cinematic wedding coverage built around the people and the day.',
    },
    {
        _id: 'f4',
        title: 'Music Video Production',
        slug: '',
        shortDescription:
            'Music videos that match the tone, rhythm, and identity of the artist.',
    },
    {
        _id: 'f5',
        title: 'NGO & Charity Video',
        slug: '',
        shortDescription:
            'Program documentation and campaign films for humanitarian work.',
    },
    {
        _id: 'f6',
        title: 'Photography & Post-Production',
        slug: '',
        shortDescription:
            'Event, portrait, and documentary photography plus editing and color.',
    },
];

async function safeList() {
    try {
        const items = await listPublishedServices();
        return items.length > 0 ? items : FALLBACK_SERVICES;
    } catch {
        return FALLBACK_SERVICES;
    }
}

export default async function ServicesOverview() {
    const { services } = HOME;
    const items = await safeList();

    return (
        <section className="section-padding bg-light">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <Reveal>
                        <SectionHeading
                            eyebrow={services.eyebrow}
                            title={services.title}
                            description={services.description}
                        />
                    </Reveal>
                    <Reveal delay={0.1}>
                        <Button href={services.ctaHref} variant="secondary" size="sm">
                            {services.ctaLabel}
                        </Button>
                    </Reveal>
                </div>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.slice(0, 6).map((service, i) => (
                        <li key={String(service._id)} className="h-full">
                            <Reveal className="h-full" delay={i * STAGGER_STEP}>
                                <TiltCard className="h-full" maxTilt={4}>
                                    <ServiceCard service={service} index={i} />
                                </TiltCard>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}