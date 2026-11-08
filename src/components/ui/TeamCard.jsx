import Image from 'next/image';
import { Aperture, Camera, Clapperboard, Film, Focus, Mic, Palette, PenTool, Scissors } from 'lucide-react';
import { buildImageUrl } from '@/lib/cloudinary';
import { TEAM_BACKDROPS, teamBackdrop } from '@/lib/teamBackdrop';
import TeamBackdropBoundary from '@/components/team/TeamBackdropBoundary';

// Brand marks are inline: lucide ships no social glyphs.
const SOCIALS = {
    linkedin: {
        label: 'LinkedIn',
        tile: 'bg-[#0a66c2] hover:bg-[#09559f]',
        path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z',
    },
    instagram: {
        label: 'Instagram',
        tile: 'bg-[linear-gradient(45deg,#f9ce34,#ee2a7b_50%,#6228d7)]',
        path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z',
    },
};

// Ordered: the first match wins, so grading must be tested before the generic edit verbs.
const ROLE_ICONS = [
    [/colour|color|grad/i, 'palette'],
    [/video edit|film edit|video editor|film editor|motion edit/i, 'clapperboard'],
    [/video|film|^editor$/i, 'film'],
    [/edit|post|assembl/i, 'scissors'],
    [/camera|dp\b|cinematog|shoot|photo/i, 'camera'],
    [/direct|produc|founder|lead/i, 'clapperboard'],
    [/motion|anim|graphic|design|brand/i, 'pen'],
    [/sound|audio|mic/i, 'mic'],
    [/focus|pull/i, 'focus'],
];

// A record, not a lookup during render — a component chosen inside render trips the
// react-hooks/static-components lint.
const ROLE_GLYPHS = {
    palette: <Palette className="h-3.5 w-3.5" aria-hidden="true" />,
    film: <Film className="h-3.5 w-3.5" aria-hidden="true" />,
    scissors: <Scissors className="h-3.5 w-3.5" aria-hidden="true" />,
    camera: <Camera className="h-3.5 w-3.5" aria-hidden="true" />,
    clapperboard: <Clapperboard className="h-3.5 w-3.5" aria-hidden="true" />,
    pen: <PenTool className="h-3.5 w-3.5" aria-hidden="true" />,
    mic: <Mic className="h-3.5 w-3.5" aria-hidden="true" />,
    focus: <Focus className="h-3.5 w-3.5" aria-hidden="true" />,
    default: <Aperture className="h-3.5 w-3.5" aria-hidden="true" />,
};

function roleGlyph(role) {
    const match = ROLE_ICONS.find(([pattern]) => pattern.test(role || ''));
    return ROLE_GLYPHS[match ? match[1] : 'default'];
}

function initials(name) {
    return name
        .split(/\s+/)
        .filter((part) => /[A-Za-z0-9]/.test(part))
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function backdropVariant(palette) {
    return TEAM_BACKDROPS.indexOf(palette);
}

/**
 * @param {{
 *   member: {
 *     name: string,
 *     role?: string,
 *     bio?: string,
 *     expertise?: string[],
 *     photo?: { publicId: string, alt?: string },
 *     social?: { linkedin?: string, instagram?: string },
 *   },
 * }} props
 */
export default function TeamCard({ member }) {
    const { _id, name, role, bio, expertise = [], photo, social } = member;

    const hasImage = Boolean(photo?.publicId);
    const imageSrc = hasImage ? buildImageUrl(photo.publicId, { width: 640, crop: 'fill' }) : null;
    const socials = Object.entries(SOCIALS)
        .map(([key, meta]) => ({ key, ...meta, href: social?.[key] }))
        .filter((s) => s.href);
    const palette = teamBackdrop(_id || name);

    return (
        <article className="group h-full">
            {/* Two boxes on purpose: the tilt owns the transform and must not clip, so the
                rounded mask lives on the inner frame instead of this element. */}
            <div
                data-tilt=""
                className="tilt-card specular-warm h-full rounded-[1.25rem] ring-1 ring-navy/8 shadow-[0_1px_2px_rgba(0,19,62,0.06),0_18px_40px_-24px_rgba(0,19,62,0.35)] transition-[box-shadow,ring-color] duration-500 ease-[var(--ease-cinematic)] group-hover:ring-orange/40 group-hover:shadow-[0_2px_4px_rgba(0,19,62,0.07),0_30px_60px_-28px_rgba(0,19,62,0.45)]"
            >
                <div className="flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white leading-normal">
                    <div className="relative m-2.5 aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-navy-dark">
                        {/* The palette gradient is the static frame; the shader drifts over it in place of
                            a photo, or stays as a colour edge behind one. */}
                        <div
                            aria-hidden="true"
                            className={`absolute inset-0 bg-gradient-to-br ${palette.wash}`}
                        />
                        <TeamBackdropBoundary variant={backdropVariant(palette)} palette={palette.mesh} />

                        {hasImage ? (
                            <Image
                                src={imageSrc}
                                alt={photo.alt || `${name}${role ? `, ${role}` : ''}`}
                                fill
                                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                                className="object-cover object-top opacity-90 transition-[transform,opacity] duration-[900ms] ease-[var(--ease-cinematic)] group-hover:scale-[1.05] group-hover:opacity-100"
                            />
                        ) : (
                            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                                <div className="stage__grain absolute inset-0 opacity-[0.08] [&::before]:animate-none" />
                                {/* Ring + disc: a monogram that reads as designed, not a letter on a box. */}
                                <span
                                    className={`absolute aspect-square w-[62%] rounded-full border ${palette.ink} opacity-[0.16] [border-width:1.5px]`}
                                />
                                <span
                                    className={`relative flex aspect-square w-[46%] shrink-0 items-center justify-center rounded-full ${palette.glow} ring-1 ring-inset ring-white/60 shadow-[0_10px_30px_-12px_rgba(0,19,62,0.45)] backdrop-blur-sm`}
                                >
                                    <span
                                        className={`text-[2.4rem] font-extrabold leading-none tracking-tight ${palette.ink} opacity-90`}
                                    >
                                        {initials(name) || '\u2014'}
                                    </span>
                                </span>
                            </div>
                        )}

                        {/* Bottom scrim: keeps the floating role chip legible over any photo. */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-dark/75 via-navy-dark/20 to-transparent"
                        />

                        {role && (
                            <span className="tilt-lift-2 absolute inset-x-0 bottom-3 mx-auto flex w-fit max-w-[calc(100%-1.25rem)] items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10.5px] font-semibold uppercase leading-none tracking-[0.1em] text-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md">
                                {roleGlyph(role)}
                                <span>{role}</span>
                            </span>
                        )}
                    </div>

                    <div className="tilt-lift-1 flex flex-1 flex-col items-center px-4 pb-5 pt-3 text-center">
                        <h3 className="text-navy text-[1.0625rem] font-bold leading-snug">{name}</h3>

                        {bio && (
                            <p className="text-slate mt-2 line-clamp-3 text-[0.8125rem] leading-6">
                                {bio}
                            </p>
                        )}
                        {/* Cards without a bio still get a rule, so the name never floats. */}
                        <span
                            aria-hidden="true"
                            className={`h-px w-10 rounded-full bg-gradient-to-r from-transparent via-orange/70 to-transparent ${bio ? 'mt-3' : 'mt-2.5'}`}
                        />

                        {expertise.length > 0 && (
                            <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                                {expertise.slice(0, 3).map((e) => (
                                    <li
                                        key={e}
                                        className="rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold text-[#9a6400] ring-1 ring-inset ring-orange/20"
                                    >
                                        {e}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {socials.length > 0 && (
                            <div className="mt-auto flex items-center justify-center gap-2 pt-4 leading-none">
                                {socials.map(({ key, label, href, tile, path }) => (
                                    <a
                                        key={key}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${name} on ${label}`}
                                        className={`inline-flex h-8 w-8 items-center justify-center rounded-[0.6rem] text-white shadow-[0_4px_12px_-4px_rgba(0,19,62,0.5)] transition-transform duration-300 ease-[var(--ease-cinematic)] hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${tile}`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="h-3.5 w-3.5"
                                            aria-hidden="true"
                                        >
                                            <path d={path} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
