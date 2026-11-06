import Link from 'next/link';
import Image from 'next/image';
import { buildImageUrl } from '@/lib/cloudinary';

/**
 * @param {{
 *   project: {
 *     title: string,
 *     slug: string,
 *     shortDescription?: string,
 *     category?: string,
 *     year?: number,
 *     location?: string,
 *     featuredImage?: { publicId: string, alt?: string } | null,
 *   },
 * }} props
 */
export default function ProjectCard({ project }) {
    const { title, slug, shortDescription, category, year, location, featuredImage } =
        project;

    const hasImage = Boolean(featuredImage?.publicId);
    const imageSrc = hasImage
        ? buildImageUrl(featuredImage.publicId, { width: 960, crop: 'fill' })
        : null;

    return (
        <article className="group">
            <Link
                href={`/work/${slug}`}
                data-tilt=""
                className="tilt-card specular elevate-2 block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
            >
                <div className="relative aspect-[4/3] w-full bg-navy-dark overflow-hidden rounded-lg">
                    {hasImage ? (
                        <Image
                            src={imageSrc}
                            alt={featuredImage.alt || title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center text-white/30 text-sm tracking-widest uppercase"
                        >
                            AniLine
                        </div>
                    )}
                </div>

                <div className="tilt-lift-2 pt-5">
                    {category && (
                        <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                            {category}
                        </p>
                    )}
                    <h3 className="text-navy text-xl leading-snug group-hover:text-navy-dark">
                        {title}
                    </h3>
                    {shortDescription && (
                        <p className="text-slate text-sm mt-2 line-clamp-2">{shortDescription}</p>
                    )}
                    {(year || location) && (
                        <p className="text-slate text-xs mt-3 uppercase tracking-wider">
                            {[location, year].filter(Boolean).join(' \u00b7 ')}
                        </p>
                    )}
                </div>
            </Link>
        </article>
    );
}