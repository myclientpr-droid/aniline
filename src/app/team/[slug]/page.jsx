import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import TeamPortrait from '@/components/team/TeamPortrait';
import TeamSocialLinks from '@/components/team/TeamSocialLinks';
import { getPublishedTeamMemberBySlug, listPublishedTeamMemberSlugs } from '@/lib/data/team';
import { slugify } from '@/lib/slug';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, personNodes, webPageJsonLd } from '@/lib/schema';
import { SITE } from '@/lib/site';

// Members get published after a build, so an unbuilt slug must still resolve on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
    try {
        const rows = await listPublishedTeamMemberSlugs();
        // Two members sharing a name heal to the same slug; a duplicate param would render twice.
        const slugs = [...new Set(rows.map((r) => r.slug || slugify(r.name)).filter(Boolean))];
        return slugs.map((slug) => ({ slug }));
    } catch {
        return [];
    }
}

async function getMember(slug) {
    try {
        return await getPublishedTeamMemberBySlug(slug);
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await Promise.resolve(params);
    const member = await getMember(slug);
    if (!member) {
        return buildMetadata({
            title: 'Team member not found',
            path: `/team/${slug}`,
            noIndex: true,
        });
    }
    return buildMetadata({
        title: `${member.name}${member.role ? ` \u2014 ${member.role}` : ''} | ${SITE.name}`,
        description: member.bio ? member.bio.slice(0, 180) : undefined,
        // The healed slug, so the canonical always matches the URL that resolved.
        path: `/team/${member.slug}`,
        ogType: 'profile',
    });
}

export default async function TeamMemberPage({ params }) {
    const { slug } = await Promise.resolve(params);
    const member = await getMember(slug);
    if (!member) notFound();

    const path = `/team/${member.slug}`;
    const expertise = Array.isArray(member.expertise) ? member.expertise : [];
    const [person] = personNodes([member]);

    const nodes = [
        webPageJsonLd({
            path,
            name: member.name,
            description: member.bio || undefined,
            ...(person?.['@id'] ? { about: { '@id': person['@id'] } } : {}),
        }),
        breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Our Team', path: '/team' },
            { name: member.name, path },
        ]),
    ];
    // Placeholder-shaped rows (no role, no bio) are deliberately not published as people.
    if (person) nodes.push({ ...person, '@context': 'https://schema.org' });

    return (
        <>
            <JsonLd data={nodes} />

            <PageHero
                eyebrow="Team"
                title={member.name}
                subheading={member.role || undefined}
            />

            <div className="bg-white">
                <Container className="pt-6">
                    <Breadcrumb
                        items={[
                            { name: 'Home', path: '/' },
                            { name: 'Our Team', path: '/team' },
                            { name: member.name },
                        ]}
                    />
                </Container>
            </div>

            <section className="section-padding bg-white">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="md:col-span-5">
                            <TeamPortrait member={member} ratio="profile" showRoleChip={false} priority />
                        </div>

                        <div className="md:col-span-6 md:col-start-7">
                            <div className="flex flex-col gap-8">
                                {member.bio && (
                                    <p className="rise whitespace-pre-line text-slate text-base md:text-lg leading-relaxed">
                                        {member.bio}
                                    </p>
                                )}

                                {expertise.length > 0 && (
                                    <div>
                                        <span
                                            aria-hidden="true"
                                            className="depth-rule mb-4 block"
                                        />
                                        <h2 className="text-navy mb-4">Expertise</h2>
                                        <ul className="flex flex-wrap gap-2">
                                            {expertise.map((e) => (
                                                <li
                                                    key={e}
                                                    className="rounded-full bg-orange/10 px-3 py-1.5 text-[12.5px] font-semibold text-[#9a6400] ring-1 ring-inset ring-orange/20"
                                                >
                                                    {e}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <TeamSocialLinks member={member} />

                                <div>
                                    <Button href="/team" variant="secondary" size="lg">
                                        Back to the team
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <CtaSection />
        </>
    );
}
