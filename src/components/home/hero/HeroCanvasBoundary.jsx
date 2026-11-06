'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import {
    HERO_TIERS,
    getHeroTierServerSnapshot,
    getHeroTierSnapshot,
    subscribeHeroTier,
} from '@/lib/heroCapabilities';

// `ssr: false` is only legal inside a Client Component, which is why this wrapper exists
// separately from the server-rendered Hero.
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

/**
 * Decides whether the WebGL hero is worth downloading three.js for. The server snapshot is always
 * `css`, so the markup is identical on every device and the canvas only appears after hydration.
 *
 * @param {{ videoSrcs?: string[], videoSrcsLite?: string[] }} props
 */
export default function HeroCanvasBoundary({ videoSrcs = [], videoSrcsLite = [] }) {
    const tier = useSyncExternalStore(subscribeHeroTier, getHeroTierSnapshot, getHeroTierServerSnapshot);

    if (tier === HERO_TIERS.CSS) return null;

    // Phones get the narrower reel; either list alone is enough to play something.
    const srcs =
        tier === HERO_TIERS.GL_LITE
            ? videoSrcsLite.length > 0
                ? videoSrcsLite
                : videoSrcs
            : videoSrcs;

    return <HeroCanvas tier={tier} videoSrcs={srcs} />;
}
