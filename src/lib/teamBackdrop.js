/**
 * Team-card backdrops. One palette per member, chosen from a stable hash so a person keeps their
 * colours across pages and renders; the no-photo monogram and the animated mesh share the palette.
 *
 * Colours are plain sRGB floats (0–1): they are authored here, sampled directly by the shader and
 * written straight to the drawing buffer, so no colour space is decoded or re-encoded on the way.
 */
export const TEAM_BACKDROPS = [
    {
        wash: 'from-[#ffe7b0] via-[#ffc04d] to-[#f59e0b]',
        ink: 'text-[#8a5300]',
        glow: 'bg-white/45',
        mesh: {
            a: [0.996, 0.647, 0.0],
            b: [1.0, 0.635, 0.392],
            c: [1.0, 0.957, 0.855],
            d: [0.722, 0.325, 0.043],
        },
    },
    {
        wash: 'from-[#dbeeff] via-[#8fc6ff] to-[#3b82f6]',
        ink: 'text-[#123a7a]',
        glow: 'bg-white/40',
        mesh: {
            a: [0.231, 0.51, 0.965],
            b: [0.514, 0.663, 1.0],
            c: [0.859, 0.933, 1.0],
            d: [0.059, 0.196, 0.478],
        },
    },
    {
        wash: 'from-[#ffdfe9] via-[#fb9fc0] to-[#db2777]',
        ink: 'text-[#7a0f3d]',
        glow: 'bg-white/40',
        mesh: {
            a: [0.859, 0.153, 0.467],
            b: [1.0, 0.659, 0.788],
            c: [1.0, 0.914, 0.941],
            d: [0.478, 0.059, 0.239],
        },
    },
    {
        wash: 'from-[#d5f7ec] via-[#7ee0c6] to-[#0d9488]',
        ink: 'text-[#084b43]',
        glow: 'bg-white/40',
        mesh: {
            a: [0.075, 0.58, 0.471],
            b: [0.494, 0.878, 0.776],
            c: [0.839, 0.973, 0.925],
            d: [0.031, 0.243, 0.216],
        },
    },
];

/** @param {unknown} key */
export function teamBackdrop(key) {
    let hash = 0;
    for (const ch of String(key)) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
    return TEAM_BACKDROPS[hash % TEAM_BACKDROPS.length];
}
