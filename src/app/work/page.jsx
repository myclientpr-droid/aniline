import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import PageHero from '@/components/layout/PageHero';
import ProjectCard from '@/components/ui/ProjectCard';
import EmptyState from '@/components/ui/EmptyState';
import ProjectFilter from '@/components/work/ProjectFilter';
import CtaSection from '@/components/ui/CtaSection';
import TiltField from '@/components/motion/TiltField';
import PageSchema from '@/components/seo/PageSchema';
import { listPublishedProjects } from '@/lib/data/projects';
import { buildMetadata } from '@/lib/seo';
import { itemListJsonLd } from '@/lib/schema';
import { PROJECT_CATEGORIES } from '@/lib/constants';
import { SITE, WORK_PAGE } from '@/lib/site';

const PAGE_TITLE = 'Portfolio & Selected Productions | AniLine';
const PAGE_DESCRIPTION =
    'Selected documentary, promotional, commercial, wedding, event, music video, and creative productions by AniLine.';

export async function generateMetadata({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const category = typeof params?.category === 'string' ? params.category : '';
    if (!category) {
        return buildMetadata({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/work' });
    }
    // Filtered views are the same page under a different query: one canonical, not indexed.
    return buildMetadata({
        title: `${category} Productions | AniLine`,
        description: `AniLine's ${category.toLowerCase()} productions \u2014 documentary, promotional and creative video work.`,
        path: '/work',
        noIndex: true,
    });
}

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
            <PageSchema
                path="/work"
                title={PAGE_TITLE}
                description={PAGE_DESCRIPTION}
                type="CollectionPage"
                nodes={
                    category
                        ? []
                        : [
                              itemListJsonLd({
                                  name: 'Selected productions',
                                  items: projects.map((p) => ({
                                      name: p.title,
                                      url: `${SITE.url}/work/${p.slug}`,
                                  })),
                              }),
                          ]
                }
            />
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
                            <ul className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project, i) => (
                                    <li key={String(project._id)} className={`rise rise-${(i % 3) + 1}`}>
                                        <ProjectCard project={project} />
                                    </li>
                                ))}
                            </ul>
                        </TiltField>
                    )}
                    <div className="mt-12">
                        <Button href="/videography" variant="secondary">
                            View the films
                        </Button>
                    </div>
                </Container>
            </section>

            <CtaSection />
        </>
    );
}