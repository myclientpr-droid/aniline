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
        path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22.56.48.96.9 1.38.42.42.82.68 1.38.9.42.16 1.06.36 2.23.41 1.27.06 1.65.07 4.85.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z',
    },
};

/**
 * LinkedIn / Instagram tiles for a member. Plain anchors, never nested in another link — the team
 * card overlays its own stretched link and these have to stay individually clickable.
 *
 * @param {{
 *   member: { name: string, social?: { linkedin?: string, instagram?: string } },
 *   className?: string,
 * }} props
 */
export default function TeamSocialLinks({ member, className = '' }) {
    const socials = Object.entries(SOCIALS)
        .map(([key, meta]) => ({ key, ...meta, href: member.social?.[key] }))
        .filter((s) => s.href);

    if (socials.length === 0) return null;

    return (
        <div className={`flex items-center gap-2 leading-none ${className}`}>
            {socials.map(({ key, label, href, tile, path }) => (
                <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${label}`}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-[0.6rem] text-white shadow-[0_4px_12px_-4px_rgba(0,19,62,0.5)] transition-transform duration-300 ease-[var(--ease-cinematic)] hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${tile}`}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d={path} />
                    </svg>
                </a>
            ))}
        </div>
    );
}
