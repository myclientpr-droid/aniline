import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

export default function CommunityPositioning() {
    const { community } = HOME;
    return (
        <section className="section-padding bg-light">
            <Container>
                <div className="max-w-3xl">
                    <Reveal>
                        <SectionHeading
                            eyebrow={community.eyebrow}
                            title={community.title}
                            description={community.body}
                        />
                    </Reveal>
                </div>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {community.pillars.map((p, i) => (
                        <li key={p.title} className="h-full">
                            <Reveal className="h-full" delay={i * STAGGER_STEP}>
                                <TiltCard className="h-full rounded-lg border border-navy/10 bg-white p-6">
                                    <h3 className="text-navy text-lg">{p.title}</h3>
                                    <p className="text-slate text-sm mt-3">{p.description}</p>
                                </TiltCard>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
