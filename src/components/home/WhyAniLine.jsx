import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

export default function WhyAniLine() {
    const { why } = HOME;
    return (
        <section className="section-padding bg-light">
            <Container>
                <Reveal>
                    <SectionHeading eyebrow={why.eyebrow} title={why.title} align="center" />
                </Reveal>
                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {why.points.map((p, i) => (
                        <li key={p.title} className="h-full">
                            <Reveal className="h-full" delay={i * STAGGER_STEP}>
                                <div className="h-full bg-white rounded-lg p-6 border border-navy/10">
                                    <h3 className="text-navy text-lg">{p.title}</h3>
                                    <p className="text-slate text-sm mt-3">{p.description}</p>
                                </div>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
