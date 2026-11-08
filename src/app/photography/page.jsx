import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import PageHero from '@/components/layout/PageHero';
import Gallery from '@/components/photography/Gallery';
import TiltField from '@/components/motion/TiltField';
import ProjectFilter from '@/components/work/ProjectFilter';
import CtaSection from '@/components/ui/CtaSection';
import PageSchema from '@/components/seo/PageSchema';
import { listPublishedPhotos } from '@/lib/data/photos';
import { buildImageUrl } from '@/lib/cloudinary';
import { buildMetadata } from '@/lib/seo';
import { PHOTOGRAPHY_CATEGORIES } from '@/lib/constants';
import { PHOTOGRAPHY_PAGE } from '@/lib/site';

const PAGE_TITLE = 'Photography Portfolio | AniLine';
const PAGE_DESCRIPTION =
    'Event, portrait, documentary, commercial, and creative photography by AniLine in Cox\u2019s Bazar and on international assignments.';

export async function generateMetadata({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const category = typeof params?.category === 'string' ? params.category : '';
    if (!category) {
        return buildMetadata({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/photography' });
    }
    return buildMetadata({
        title: `${category} Photography | AniLine`,
        description: `${category} photography by AniLine \u2014 event, portrait and documentary coverage.`,
        path: '/photography',
        noIndex: true,
    });
}

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

    // A sample of the gallery as ImageObjects with real dimensions; the whole set adds no value.
    const sample = category ? [] : photos.filter((p) => p.publicId).slice(0, 12);

    return (
        <>
            <PageSchema
                path="/photography"
                title={PAGE_TITLE}
                description={PAGE_DESCRIPTION}
                type="CollectionPage"
                nodes={
                    sample.length
                        ? [
                              {
                                  '@type': 'ImageGallery',
                                  name: 'AniLine photography',
                                  image: sample.map((p) => ({
                                      '@type': 'ImageObject',
                                      contentUrl: buildImageUrl(p.publicId, { width: 1600 }),
                                      caption: p.title || p.alt || undefined,
                                      ...(p.width ? { width: p.width } : {}),
                                      ...(p.height ? { height: p.height } : {}),
                                      ...(p.location ? { contentLocation: { '@type': 'Place', name: p.location } } : {}),
                                  })),
                              },
                          ]
                        : []
                }
            />
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