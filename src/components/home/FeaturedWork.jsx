import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/ui/ProjectCard';
import EmptyState from '@/components/ui/EmptyState';
import Reveal from '@/components/motion/Reveal';
import TiltField from '@/components/motion/TiltField';
import { listPublishedProjects } from '@/lib/data/projects';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

async function safeList() {
    try {
        return await listPublishedProjects({ page: 1, pageSize: 6, featuredOnly: true });
    } catch {
        return { items: [], total: 0 };
    }
}

export default async function FeaturedWork() {
    const { featuredWork } = HOME;
    const { items } = await safeList();

    return (
        <section className="section-padding bg-white">
            <Container>
                <Reveal>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <SectionHeading
                            eyebrow={featuredWork.eyebrow}
                            title={featuredWork.title}
                            description={featuredWork.description}
                        />
                        {items.length > 0 && (
                            <Button href={featuredWork.ctaHref} variant="secondary" size="sm">
                                {featuredWork.ctaLabel}
                            </Button>
                        )}
                    </div>
                </Reveal>

                {items.length === 0 ? (
                    <div className="mt-10">
                        <EmptyState
                            title="Featured work coming soon"
                            message="We\u2019re preparing a selection of recent projects. Check back shortly."
                            actionHref="/work"
                            actionLabel="Browse all work"
                        />
                    </div>
                ) : (
                    <TiltField className="mt-12">
                        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((project, i) => (
                                <li key={String(project._id)}>
                                    <Reveal delay={i * STAGGER_STEP}>
                                        <ProjectCard project={project} />
                                    </Reveal>
                                </li>
                            ))}
                        </ul>
                    </TiltField>
                )}
            </Container>
        </section>
    );
}