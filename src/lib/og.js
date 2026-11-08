import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

/**
 * Social cards. Fonts are bundled in `public/fonts` because the next/font file is not addressable
 * at render time and fetching from Google would make every card depend on the network.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';
export const ogAlt = `${SITE.name} \u2014 ${SITE.seoTagline}`;

const NAVY = '#00133e';
const NAVY_DARK = '#00071a';
const ORANGE = '#fea500';

let fontsPromise = null;

function loadFonts() {
    fontsPromise ??= Promise.all([
        readFile(join(process.cwd(), 'public/fonts/manrope-500.ttf')),
        readFile(join(process.cwd(), 'public/fonts/manrope-700.ttf')),
        readFile(join(process.cwd(), 'public/fonts/manrope-800.ttf')),
    ]).then(([medium, bold, extraBold]) => [
        { name: 'Manrope', data: medium, weight: 500, style: 'normal' },
        { name: 'Manrope', data: bold, weight: 700, style: 'normal' },
        { name: 'Manrope', data: extraBold, weight: 800, style: 'normal' },
    ]);
    return fontsPromise;
}

function host() {
    return SITE.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/**
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   subtitle?: string,
 *   imageUrl?: string,
 *   footer?: string,
 * }} card
 */
export async function renderOgCard({ eyebrow, title, subtitle, imageUrl, footer }) {
    const fonts = await loadFonts();

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    backgroundColor: NAVY_DARK,
                    fontFamily: 'Manrope',
                    color: '#ffffff',
                }}
            >
                {imageUrl && (
                    // The still is the subject; the navy panel below carries the type.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt=""
                        width={640}
                        height={630}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 640,
                            height: 630,
                            objectFit: 'cover',
                        }}
                    />
                )}

                {/* Gradient wash: lightens the navy, then fades into solid for the text column. */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        background: imageUrl
                            ? `linear-gradient(90deg, rgba(0,13,43,0.15) 0%, rgba(0,7,26,0.85) 42%, ${NAVY_DARK} 58%)`
                            : `radial-gradient(1100px 700px at 82% 18%, #0a2a6b 0%, ${NAVY} 46%, ${NAVY_DARK} 100%)`,
                    }}
                />

                {/* Brand strip top-left */}
                <div
                    style={{
                        position: 'absolute',
                        top: 56,
                        left: 64,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                    }}
                >
                    <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 999, background: ORANGE }} />
                    <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>
                        {/* Two spans, not inline markup: Satori flattens mixed children. */}
                        <span style={{ display: 'flex' }}>Ani</span>
                        <span style={{ display: 'flex', color: ORANGE }}>Line</span>
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        left: imageUrl ? 660 : 64,
                        right: 64,
                        top: 150,
                        bottom: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    {eyebrow && (
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                letterSpacing: 3,
                                textTransform: 'uppercase',
                                color: ORANGE,
                                marginBottom: 18,
                                display: 'flex',
                            }}
                        >
                            {eyebrow}
                        </div>
                    )}
                    <div
                        style={{
                            fontSize: title.length > 48 ? 56 : 68,
                            fontWeight: 800,
                            lineHeight: 1.08,
                            letterSpacing: -1.5,
                            maxWidth: imageUrl ? 480 : 980,
                            display: 'flex',
                        }}
                    >
                        {title}
                    </div>
                    {subtitle && (
                        <div
                            style={{
                                marginTop: 24,
                                fontSize: 26,
                                fontWeight: 500,
                                lineHeight: 1.35,
                                color: 'rgba(255,255,255,0.78)',
                                maxWidth: imageUrl ? 470 : 820,
                                display: 'flex',
                            }}
                        >
                            {subtitle}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        left: 64,
                        right: 64,
                        bottom: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 22,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.55)',
                    }}
                >
                    <div style={{ display: 'flex', gap: 16 }}>
                        <span>{footer || SITE.seoTagline}</span>
                    </div>
                    <span>{host()}</span>
                </div>

                {/* Bottom accent rule */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 8,
                        display: 'flex',
                        background: `linear-gradient(90deg, ${ORANGE} 0%, ${ORANGE} 22%, transparent 22%)`,
                    }}
                />
            </div>
        ),
        { ...ogSize, fonts }
    );
}
