import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import ProjectCard from '@/components/ui/ProjectCard';
import EmptyState from '@/components/ui/EmptyState';
import ProjectFilter from '@/components/work/ProjectFilter';
import CtaSection from '@/components/ui/CtaSection';
import TiltField from '@/components/motion/TiltField';
import { listPublishedProjects } from '@/lib/data/projects';
import { buildMetadata } from '@/lib/seo';
import { PROJECT_CATEGORIES } from '@/lib/constants';
import { WORK_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Our Work',
    description:
        'Selected documentary, promotional, commercial, wedding, event, music video, and creative productions by AniLine.',
    path: '/work',
});

async function fetchProjects(category) {
    try {
        const result = await listPublishedProjects({
            page: 1,
            pageSize: 48,
            category: category || undefined,
        });
        return result.items;
    } catch {
        return [];
    }
}

export default async function WorkPage({ searchParams }) {
    // Next.js 16: searchParams is async on server components
    const params = await Promise.resolve(searchParams);
    const category = typeof params?.category === 'string' ? params.category : '';
    const { hero, empty } = WORK_PAGE;
    const projects = await fetchProjects(category);

    return (
        <>
            {/* Hero */}
            <PageHero
                eyebrow={hero.eyebrow}
                title={hero.title}
                subheading={hero.subheading}
            />

            {/* Filter */}
            <ProjectFilter categories={PROJECT_CATEGORIES} allLabel="All work" />

            {/* Grid */}
            <section className="section-padding bg-white">
                <Container>
                    {projects.length === 0 ? (
                        <EmptyState
                            title={empty.title}
                            message={empty.message}
                            actionHref={category ? '/work' : undefined}
                            actionLabel={category ? 'View all work' : undefined}
                        />
                    ) : (
                        <TiltField>
                            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project, i) => (
                                    <li key={String(project._id)} className={`rise rise-${(i % 3) + 1}`}>
                                        <ProjectCard project={project} />
                                    </li>
                                ))}
                            </ul>
                        </TiltField>
                    )}
                </Container>
            </section>

            <CtaSection />
        </>
    );
}