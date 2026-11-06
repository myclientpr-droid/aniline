import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

export default function Introduction() {
    const { intro } = HOME;
    return (
        <section className="section-padding bg-white">
            <Container>
                <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <Reveal>
                            <SectionHeading eyebrow={intro.eyebrow} title={intro.title} />
                        </Reveal>
                    </div>
                    <div className="md:col-span-7 space-y-5">
                        {intro.body.map((p, i) => (
                            <Reveal key={i} delay={i * STAGGER_STEP}>
                                <p className="text-slate text-base md:text-lg leading-relaxed">
                                    {p}
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
