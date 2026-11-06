import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import TeamCard from '@/components/ui/TeamCard';
import CtaSection from '@/components/ui/CtaSection';
import Button from '@/components/ui/Button';
import { listPublishedTeamMembers } from '@/lib/data/team';
import { buildMetadata } from '@/lib/seo';
import { TEAM_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Our Team',
    description:
        'Meet the four-member AniLine team \u2014 a Rohingya-led video production and photography studio established in 2020.',
    path: '/team',
});

async function getTeam() {
    try {
        const items = await listPublishedTeamMembers();
        return items.length > 0 ? items : null;
    } catch {
        return null;
    }
}

export default async function TeamPage() {
    const { hero, fallbackMembers, join } = TEAM_PAGE;
    const real = await getTeam();
    const members = real ?? fallbackMembers;
    const hasReal = Array.isArray(real) && real.length > 0;

    return (
        <>
            {/* Hero */}
            <PageHero
                eyebrow={hero.eyebrow}
                title={hero.title}
                subheading={hero.subheading}
            />

            {/* Team grid */}
            <section className="section-padding bg-white">
                <Container>
                    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {members.map((member, i) => (
                            <li key={String(member._id)} className={`rise rise-${(i % 4) + 1}`}>
                                <TeamCard member={member} />
                            </li>
                        ))}
                    </ul>

                    {!hasReal && (
                        <p className="text-slate text-sm text-center mt-10">
                            Team profiles are being prepared. Real names, roles, and photographs
                            will appear here shortly.
                        </p>
                    )}
                </Container>
            </section>

            {/* Join CTA */}
            <section className="section-padding bg-light">
                <Container>
                    <div className="rise mx-auto max-w-2xl text-center">
                        <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mb-3">
                            {join.eyebrow}
                        </p>
                        <h2 className="text-navy text-balance">{join.title}</h2>
                        <p className="text-slate mt-4">{join.description}</p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Button href="/start-a-project" variant="primary" size="lg">
                                Start a Project
                            </Button>
                            <Button href="/contact" variant="secondary" size="lg">
                                Contact us
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            <CtaSection />
        </>
    );
}