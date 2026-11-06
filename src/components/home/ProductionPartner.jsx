import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

export default function ProductionPartner() {
    const { partner } = HOME;
    return (
        <section className="section-padding bg-navy-dark text-white">
            <Container>
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <SectionHeading
                                eyebrow={partner.eyebrow}
                                title={partner.title}
                                description={partner.body}
                                tone="light"
                            />
                            <div className="mt-8">
                                <Button href="/contact" variant="primary">
                                    Discuss a collaboration
                                </Button>
                            </div>
                        </Reveal>
                    </div>

                    <ul className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
                        {partner.items.map((item, i) => (
                            <li key={item.title}>
                                <Reveal delay={i * STAGGER_STEP}>
                                    <div className="h-full rounded-lg border border-white/10 bg-white/[0.03] p-6">
                                        <h3 className="text-white text-lg">{item.title}</h3>
                                        <p className="text-white/70 text-sm mt-3">
                                            {item.description}
                                        </p>
                                    </div>
                                </Reveal>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}