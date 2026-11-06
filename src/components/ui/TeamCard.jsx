import Image from 'next/image';
import { buildImageUrl } from '@/lib/cloudinary';

/**
 * @param {{
 *   member: {
 *     name: string,
 *     role?: string,
 *     bio?: string,
 *     expertise?: string[],
 *     photo?: { publicId: string, alt?: string },
 *   },
 * }} props
 */
export default function TeamCard({ member }) {
    const { name, role, bio, expertise = [], photo } = member;

    const hasImage = Boolean(photo?.publicId);
    const imageSrc = hasImage
        ? buildImageUrl(photo.publicId, { width: 640, height: 800, crop: 'fill' })
        : null;

    return (
        <article className="group h-full">
            {/* The tilt box is separate from the mask box: `overflow-hidden` on this element
                would collapse `preserve-3d` and flatten the lifted text. */}
            <div
                data-tilt=""
                className="tilt-card specular elevate-2 h-full rounded-lg"
            >
                <div className="relative aspect-[4/5] w-full bg-light overflow-hidden rounded-lg">
                    {hasImage ? (
                        <Image
                            src={imageSrc}
                            alt={photo.alt || `${name}${role ? `, ${role}` : ''}`}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center text-slate/40 text-sm tracking-widest uppercase"
                        >
                            {name.split(' ')[0]}
                        </div>
                    )}
                </div>
                <div className="tilt-lift-2 pt-5">
                    {role && (
                        <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                            {role}
                        </p>
                    )}
                    <h3 className="text-navy text-xl">{name}</h3>
                    {bio && <p className="text-slate text-sm mt-3">{bio}</p>}
                    {expertise.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {expertise.map((e) => (
                                <li
                                    key={e}
                                    className="text-xs text-slate border border-navy/10 rounded-full px-3 py-1"
                                >
                                    {e}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </article>
    );
}