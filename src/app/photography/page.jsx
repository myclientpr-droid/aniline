import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import PageHero from '@/components/layout/PageHero';
import Gallery from '@/components/photography/Gallery';
import TiltField from '@/components/motion/TiltField';
import ProjectFilter from '@/components/work/ProjectFilter';
import CtaSection from '@/components/ui/CtaSection';
import { listPublishedPhotos } from '@/lib/data/photos';
import { buildMetadata } from '@/lib/seo';
import { PHOTOGRAPHY_CATEGORIES } from '@/lib/constants';
import { PHOTOGRAPHY_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Photography',
    description:
        'Event, portrait, documentary, commercial, and creative photography by AniLine.',
    path: '/photography',
});

async function fetchPhotos(category) {
    try {
        return await listPublishedPhotos({ category: category || undefined });
    } catch {
        return [];
    }
}

export default async function PhotographyPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const category = typeof params?.category === 'string' ? params.category : '';
    const { hero, empty } = PHOTOGRAPHY_PAGE;
    const photos = await fetchPhotos(category);

    return (
        <>
            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            <ProjectFilter
                categories={PHOTOGRAPHY_CATEGORIES}
                allLabel={PHOTOGRAPHY_PAGE.filter.allLabel}
            />

            <section className="section-padding bg-white">
                <Container>
                    {photos.length === 0 ? (
                        <EmptyState
                            title={empty.title}
                            message={empty.message}
                            actionHref={category ? '/photography' : undefined}
                            actionLabel={category ? 'View all photographs' : undefined}
                        />
                    ) : (
                        <TiltField>
                            <Gallery photos={photos} />
                        </TiltField>
                    )}
                </Container>
            </section>

            <CtaSection />
        </>
    );
}