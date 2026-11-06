import Image from 'next/image';
import { buildImageUrl } from '@/lib/cloudinary';

/**
 * @param {{
 *   client: {
 *     name: string,
 *     type?: string,
 *     shortDescription?: string,
 *     location?: string,
 *     logo?: { publicId: string, alt?: string },
 *     website?: string,
 *   },
 * }} props
 */
export default function ClientCard({ client }) {
    const { name, type, shortDescription, location, logo, website } = client;

    const hasLogo = Boolean(logo?.publicId);
    const logoSrc = hasLogo
        ? buildImageUrl(logo.publicId, { width: 400, height: 400, crop: 'fit' })
        : null;

    const initial = name ? name.charAt(0).toUpperCase() : '?';

    const Wrapper = website ? 'a' : 'div';
    const wrapperProps = website
        ? {
            href: website,
            target: '_blank',
            rel: 'noopener noreferrer',
            'data-tilt': '',
        }
        : { 'data-tilt': '' };

    return (
        <article className="group h-full">
            <Wrapper
                {...wrapperProps}
                className="tilt-card specular-warm elevate-2 block h-full rounded-lg bg-white p-6"
            >
                {/* Logo or initial mark */}
                <div className="tilt-lift-2 h-20 flex items-center">
                    {hasLogo ? (
                        <div className="relative h-16 w-32">
                            <Image
                                src={logoSrc}
                                alt={logo.alt || name}
                                fill
                                sizes="128px"
                                className="object-contain object-left"
                            />
                        </div>
                    ) : (
                        <div
                            aria-hidden="true"
                            className="h-14 w-14 rounded-lg bg-navy text-white flex items-center justify-center text-xl font-bold"
                        >
                            {initial}
                        </div>
                    )}
                </div>

                {/* Name + type */}
                <div className="tilt-lift-1 mt-5">
                    {type && (
                        <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                            {type}
                        </p>
                    )}
                    <h3 className="text-navy text-lg leading-snug">{name}</h3>

                    {shortDescription && (
                        <p className="text-slate text-sm mt-3 line-clamp-3">
                            {shortDescription}
                        </p>
                    )}

                    {location && (
                        <p className="text-slate text-xs mt-3 uppercase tracking-wider">
                            {location}
                        </p>
                    )}
                </div>
            </Wrapper>
        </article>
    );
}