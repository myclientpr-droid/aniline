import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import TeamCard from '@/components/ui/TeamCard';
import Reveal from '@/components/motion/Reveal';
import { listPublishedTeamMembers } from '@/lib/data/team';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

async function safeList() {
    try {
        const items = await listPublishedTeamMembers();
        return items.slice(0, 4);
    } catch {
        return [];
    }
}

export default async function TeamPreview() {
    const { teamPreview } = HOME;
    const members = await safeList();
    const display =
        members.length > 0
            ? members
            : teamPreview.fallbackMembers.map((m, i) => ({ ...m, _id: `t${i}` }));

    return (
        <section className="section-padding bg-white">
            <Container>
                <Reveal>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <SectionHeading
                            eyebrow={teamPreview.eyebrow}
                            title={teamPreview.title}
                            description={teamPreview.description}
                        />
                        {members.length > 0 && (
                            <Button href={teamPreview.ctaHref} variant="secondary" size="sm">
                                {teamPreview.ctaLabel}
                            </Button>
                        )}
                    </div>
                </Reveal>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {display.map((member, i) => (
                        <li key={String(member._id)}>
                            <Reveal delay={i * STAGGER_STEP}>
                                <TeamCard member={member} />
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}