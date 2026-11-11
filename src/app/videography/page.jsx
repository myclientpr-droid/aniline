import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import PageHero from '@/components/layout/PageHero';
import FeaturedFilm from '@/components/videography/FeaturedFilm';
import VideoCard from '@/components/ui/VideoCard';
import TiltField from '@/components/motion/TiltField';
import ProjectFilter from '@/components/work/ProjectFilter';
import CtaSection from '@/components/ui/CtaSection';
import PageSchema from '@/components/seo/PageSchema';
import { listPublishedVideos, listTopPublishedVideo } from '@/lib/data/videos';
import { itemListJsonLd } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { VIDEO_CATEGORIES } from '@/lib/constants';
import { SITE, VIDEOGRAPHY_PAGE } from '@/lib/site';

const PAGE_TITLE = 'Videography Portfolio | AniLine';
const PAGE_DESCRIPTION =
    'Documentary, campaign, wedding, event, and music videos by AniLine \u2014 shot, cut and graded in Cox\u2019s Bazar and on assignment.';

export async function generateMetadata({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const category = typeof params?.category === 'string' ? params.category : '';
    if (!category) {
        return buildMetadata({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: '/videography' });
    }
    // Filtered views are the same page under a different query: one canonical, not indexed.
    return buildMetadata({
        title: `${category} Films | AniLine`,
        description: `AniLine\u2019s ${category.toLowerCase()} films \u2014 shot, cut and graded for the screen.`,
        path: '/videography',
        noIndex: true,
    });
}

async function fetchFilms(category) {
    try {
        const [list, topFilm] = await Promise.all([
            listPublishedVideos({ page: 1, pageSize: 48, category: category || undefined }),
            // A slice cannot have a featured film: the band would leak the whole archive into it.
            category ? Promise.resolve(null) : listTopPublishedVideo(),
        ]);
        return { films: list.items, topFilm };
    } catch {
        return { films: [], topFilm: null };
    }
}

export default async function VideographyPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const category = typeof params?.category === 'string' ? params.category : '';
    const { hero, band, empty } = VIDEOGRAPHY_PAGE;
    const { films, topFilm } = await fetchFilms(category);

    return (
        <>
            <PageSchema
                path="/videography"
                title={PAGE_TITLE}
                description={PAGE_DESCRIPTION}
                type="CollectionPage"
                nodes={
                    category || !films.length
                        ? []
                        : [
                              itemListJsonLd({
                                  name: 'Videography',
                                  items: films.map((film) => ({
                                      name: film.title,
                                      url: `${SITE.url}/videography/${film.slug}`,
                                  })),
                              }),
                          ]
                }
            />

            {/* The featured reel is the hero. PageHero only appears when there is nothing to front
                the page with, so the archive never opens on a band of empty stage. */}
            {topFilm ? (
                <section className="stage section-padding text-white">
                    <div className="stage-layer stage__pool" aria-hidden="true" />
                    <div className="stage-layer stage__beam" aria-hidden="true" />
                    <div className="stage-layer stage__floor" aria-hidden="true" />
                    <div className="stage-layer stage__grain" aria-hidden="true" />
                    <div className="stage-layer stage__vignette" aria-hidden="true" />
                    <div className="stage-layer stage__seam" aria-hidden="true" />
                    <Container className="relative">
                        <FeaturedFilm film={topFilm} hero={hero} bandLabel={band.label} />
                    </Container>
                </section>
            ) : (
                <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />
            )}

            <ProjectFilter categories={VIDEO_CATEGORIES} allLabel={VIDEOGRAPHY_PAGE.filter.allLabel} />

            <section className="section-padding bg-white">
                <Container>
                    {films.length === 0 ? (
                        <EmptyState
                            title={empty.title}
                            message={empty.message}
                            actionHref={category ? '/videography' : undefined}
                            actionLabel={category ? 'View all films' : undefined}
                        />
                    ) : (
                        <TiltField>
                            <ul className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {films.map((film, i) => (
                                    <li key={String(film._id)} className={`rise rise-${(i % 3) + 1}`}>
                                        <VideoCard film={film} />
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
