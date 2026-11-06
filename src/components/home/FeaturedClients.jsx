import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { listPublishedClients } from '@/lib/data/clients';
import { buildImageUrl } from '@/lib/cloudinary';
import { HOME } from '@/lib/site';
import { STAGGER_STEP } from '@/lib/motionPresets';

async function safeList() {
    try {
        const items = await listPublishedClients({ featuredOnly: true });
        return items.slice(0, 8);
    } catch {
        return [];
    }
}

export default async function FeaturedClients() {
    const clients = await safeList();
    if (clients.length === 0) return null;

    const { featuredClients } = HOME;

    return (
        <section className="section-padding bg-white border-t border-navy/10">
            <Container>
                <Reveal>
                    <SectionHeading
                        eyebrow={featuredClients.eyebrow}
                        title={featuredClients.title}
                        description={featuredClients.description}
                        align="center"
                    />
                </Reveal>

                <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
                    {clients.map((client, i) => {
                        const hasLogo = Boolean(client.logo?.publicId);
                        const logoSrc = hasLogo
                            ? buildImageUrl(client.logo.publicId, {
                                width: 320,
                                height: 160,
                                crop: 'fit',
                            })
                            : null;

                        const initial = client.name
                            ? client.name.charAt(0).toUpperCase()
                            : '?';

                        const inner = (
                            <div className="flex flex-col items-center text-center">
                                <div className="h-16 flex items-center justify-center w-full">
                                    {hasLogo ? (
                                        <Image
                                            src={logoSrc}
                                            alt={client.logo.alt || client.name}
                                            width={160}
                                            height={80}
                                            sizes="160px"
                                            className="max-h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden="true"
                                            className="h-12 w-12 rounded-md bg-navy text-white flex items-center justify-center text-lg font-bold"
                                        >
                                            {initial}
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate text-xs mt-3 line-clamp-2 max-w-[14rem]">
                                    {client.name}
                                </p>
                            </div>
                        );

                        return (
                            <li key={String(client._id)} className="group">
                                <Reveal delay={Math.min(i, 5) * STAGGER_STEP}>
                                    {client.website ? (
                                        <a
                                            href={client.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                                            aria-label={`${client.name} (opens in new tab)`}
                                        >
                                            {inner}
                                        </a>
                                    ) : (
                                        inner
                                    )}
                                </Reveal>
                            </li>
                        );
                    })}
                </ul>

                {featuredClients.ctaLabel && featuredClients.ctaHref && (
                    <div className="mt-10 text-center">
                        <Link
                            href={featuredClients.ctaHref}
                            className="text-sm font-semibold text-navy hover:text-orange transition-colors"
                        >
                            {featuredClients.ctaLabel} &rarr;
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
}