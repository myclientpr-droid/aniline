import Image from 'next/image';
import { Aperture, Camera, Clapperboard, Film, Focus, Mic, Palette, PenTool, Scissors } from 'lucide-react';
import { buildImageUrl } from '@/lib/cloudinary';
import { TEAM_BACKDROPS, teamBackdrop } from '@/lib/teamBackdrop';
import TeamBackdropBoundary from '@/components/team/TeamBackdropBoundary';

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

// Literal-valued records throughout: Tailwind only emits classes it can see in the source.
const VARIANT = {
    card: {
        box: 'aspect-[4/5] rounded-[0.9rem]',
        monogram: 'text-[2.4rem]',
        size: 640,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw',
    },
    profile: {
        box: 'aspect-[3/4] rounded-[1.25rem]',
        monogram: 'text-[5rem]',
        size: 960,
        sizes: '(min-width: 768px) 42vw, 90vw',
    },
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

/**
 * The member's photo, or the generated monogram/backdrop when no photo was uploaded.
 *
 * @param {{
 *   member: {
 *     _id?: string,
 *     name: string,
 *     role?: string,
 *     photo?: { publicId: string, alt?: string },
 *   },
 *   ratio?: 'card' | 'profile',
 *   showRoleChip?: boolean,
 *   priority?: boolean,
 *   className?: string,
 * }} props
 */
export default function TeamPortrait({
    member,
    ratio = 'card',
    showRoleChip = true,
    priority = false,
    className = '',
}) {
    const { _id, name, role, photo } = member;
    const variant = VARIANT[ratio];

    const hasImage = Boolean(photo?.publicId);
    const imageSrc = hasImage ? buildImageUrl(photo.publicId, { width: variant.size, crop: 'fill' }) : null;
    const palette = teamBackdrop(_id || name);

    return (
        <div className={`relative overflow-hidden bg-navy-dark ${variant.box} ${className}`}>
            {/* The palette gradient is the static frame; the shader drifts over it in place of
                a photo, or stays as a colour edge behind one. */}
            <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${palette.wash}`} />
            <TeamBackdropBoundary
                variant={TEAM_BACKDROPS.indexOf(palette)}
                palette={palette.mesh}
            />

            {hasImage ? (
                <Image
                    src={imageSrc}
                    alt={photo.alt || `${name}${role ? `, ${role}` : ''}`}
                    fill
                    priority={priority}
                    sizes={variant.sizes}
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
                            className={`${variant.monogram} font-extrabold leading-none tracking-tight ${palette.ink} opacity-90`}
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

            {showRoleChip && role && (
                <span className="tilt-lift-2 absolute inset-x-0 bottom-3 mx-auto flex w-fit max-w-[calc(100%-1.25rem)] items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10.5px] font-semibold uppercase leading-none tracking-[0.1em] text-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    {roleGlyph(role)}
                    <span>{role}</span>
                </span>
            )}
        </div>
    );
}
