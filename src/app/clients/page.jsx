import Container from '@/components/ui/Container';
import ClientCard from '@/components/ui/ClientCard';
import EmptyState from '@/components/ui/EmptyState';
import PageHero from '@/components/layout/PageHero';
import ProjectFilter from '@/components/work/ProjectFilter';
import TiltField from '@/components/motion/TiltField';
import CtaSection from '@/components/ui/CtaSection';
import PageSchema from '@/components/seo/PageSchema';
import { listPublishedClients, listPublishedClientTypes } from '@/lib/data/clients';
import { buildMetadata } from '@/lib/seo';
import { CLIENTS_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Clients & Collaborators | AniLine',
    description:
        'Organizations, businesses, schools, filmmakers, and families who work with AniLine \u2014 a Rohingya-led video production and photography studio.',
    path: '/clients',
});

async function fetchData(type) {
    try {
        const [clients, types] = await Promise.all([
            listPublishedClients({ type: type || undefined }),
            listPublishedClientTypes(),
        ]);
        return { clients, types };
    } catch {
        return { clients: [], types: [] };
    }
}

export default async function ClientsPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const activeType = typeof params?.type === 'string' ? params.type : '';

    const { hero, empty } = CLIENTS_PAGE;
    const { clients, types } = await fetchData(activeType);

    return (
        <>
            <PageSchema
                path="/clients"
                title="Clients & Collaborators | AniLine"
                description={metadata.description}
                type="CollectionPage"
            />
            {/* Hero */}
            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            {/* Filter (only if there are multiple types) */}
            {types.length > 1 && (
                <ProjectFilter
                    categories={types}
                    allLabel={CLIENTS_PAGE.filter.allLabel}
                    paramName="type"
                    ariaLabel="Filter clients by type"
                />
            )}

            {/* Grid */}
            <section className="section-padding bg-white">
                <Container>
                    {clients.length === 0 ? (
                        <EmptyState
                            title={empty.title}
                            message={empty.message}
                            actionHref={activeType ? '/clients' : undefined}
                            actionLabel={activeType ? 'View all clients' : undefined}
                        />
                    ) : (
                        <TiltField>
                            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {clients.map((client, i) => (
                                    <li key={String(client._id)} className={`rise rise-${(i % 3) + 1}`}>
                                        <ClientCard client={client} />
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