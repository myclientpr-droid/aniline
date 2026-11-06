import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

export default function WhoWeWorkWith() {
    const { whoWeWorkWith } = HOME;
    return (
        <section className="section-padding bg-white">
            <Container>
                <Reveal>
                    <SectionHeading
                        eyebrow={whoWeWorkWith.eyebrow}
                        title={whoWeWorkWith.title}
                        description={whoWeWorkWith.description}
                        align="center"
                    />
                </Reveal>
                <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {whoWeWorkWith.groups.map((g, i) => (
                        <li key={g.title}>
                            <Reveal delay={Math.min(i, 5) * STAGGER_STEP}>
                                <div className="h-full rounded-lg border border-navy/10 p-5 hover:border-navy/30 transition-colors">
                                    <h3 className="text-navy text-base font-semibold">{g.title}</h3>
                                    <p className="text-slate text-sm mt-2">{g.description}</p>
                                </div>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
