/**
 * Hero render tiers, resolved once on the client.
 *
 * The homepage is server-rendered and ships no JavaScript by default, so the server snapshot is always
 * `css` — the SSR markup is identical on every device and the canvas upgrades after hydration.
 */
export const HERO_TIERS = {
    CSS: 'css',
    GL_STATIC: 'gl-static',
    GL_LITE: 'gl-lite',
    GL_VIDEO: 'gl-video',
};

const TIERS = Object.values(HERO_TIERS);

function probeWebgl() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return false;
        const debug = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '';
        // Software rasterizers render, but far slower than the CSS rung they would replace.
        if (/SwiftShader|llvmpipe|Software Basic|basic render/i.test(renderer)) return false;
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return true;
    } catch {
        return false;
    }
}

function devOverride() {
    if (process.env.NODE_ENV !== 'development') return null;
    const forced = new URLSearchParams(window.location.search).get('heroTier');
    return forced && TIERS.includes(forced) ? forced : null;
}

export function detectHeroTier() {
    if (typeof window === 'undefined') return HERO_TIERS.CSS;
    const forced = devOverride();
    if (forced) return forced;

    const connection = navigator.connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) {
        return HERO_TIERS.CSS;
    }
    if ((navigator.deviceMemory ?? 4) < 4 || (navigator.hardwareConcurrency ?? 8) <= 4) {
        return HERO_TIERS.CSS;
    }
    if (!probeWebgl()) return HERO_TIERS.CSS;

    const animated = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (!animated) return HERO_TIERS.GL_STATIC;
    return coarse ? HERO_TIERS.GL_LITE : HERO_TIERS.GL_VIDEO;
}

/** Scene knobs per tier: what to render, how heavy to make it. */
export function getHeroSceneSettings(tier) {
    switch (tier) {
        case HERO_TIERS.GL_STATIC:
            return { animated: false, edgeFx: false, maxDpr: 1.5 };
        case HERO_TIERS.GL_LITE:
            return { animated: true, edgeFx: false, maxDpr: 1.25 };
        case HERO_TIERS.GL_VIDEO:
            return { animated: true, edgeFx: true, maxDpr: 2 };
        default:
            return null;
    }
}

let cached = null;
const listeners = new Set();

function invalidate() {
    cached = null;
    listeners.forEach((emit) => emit());
}

export function subscribeHeroTier(onChange) {
    listeners.add(onChange);
    if (cached === null) {
        const mqls = [
            window.matchMedia('(prefers-reduced-motion: reduce)'),
            window.matchMedia('(pointer: coarse)'),
        ];
        mqls.forEach((mql) => mql.addEventListener('change', invalidate));
        return () => {
            listeners.delete(onChange);
            mqls.forEach((mql) => mql.removeEventListener('change', invalidate));
        };
    }
    return () => listeners.delete(onChange);
}

export function getHeroTierSnapshot() {
    if (cached === null) cached = detectHeroTier();
    return cached;
}

export const getHeroTierServerSnapshot = () => HERO_TIERS.CSS;
